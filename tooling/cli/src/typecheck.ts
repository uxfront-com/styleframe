import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import type { CheckDiagnostic } from "./utils";

/**
 * The `tsc` binary of the TypeScript a config file resolves, or undefined
 * when there is none. TypeScript 7 ships no JavaScript compiler API, so the
 * type check runs its command line.
 */
export function resolveTsc(file: string): string | undefined {
	let packageJsonPath: string;
	try {
		packageJsonPath = createRequire(file).resolve("typescript/package.json");
	} catch {
		return undefined;
	}

	const { bin } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
		bin: string | Record<string, string>;
	};
	const tscPath = typeof bin === "string" ? bin : bin.tsc;

	return tscPath && path.resolve(path.dirname(packageJsonPath), tscPath);
}

function findTsconfig(directory: string): string | undefined {
	for (let dir = directory; ; dir = path.dirname(dir)) {
		const tsconfig = path.join(dir, "tsconfig.json");
		if (existsSync(tsconfig)) {
			return tsconfig;
		}
		if (dir === path.dirname(dir)) {
			return undefined;
		}
	}
}

const LOCATED_ERROR = /^(.+)\((\d+),\d+\): (?:error|warning) (TS\d+): (.*)$/;
const GLOBAL_ERROR = /^(?:error|warning) (TS\d+): (.*)$/;

/**
 * Type-check one config file, and none of the project's other files, with
 * the compiler options of the nearest `tsconfig.json`. It writes a temporary
 * tsconfig outside the project that extends it.
 */
export async function typecheck(
	file: string,
	tsc: string,
	cwd = process.cwd(),
): Promise<CheckDiagnostic[]> {
	const tsconfig = findTsconfig(path.dirname(file));
	const directory = await mkdtemp(path.join(tmpdir(), "styleframe-typecheck-"));

	try {
		const configPath = path.join(directory, "tsconfig.json");
		await writeFile(
			configPath,
			JSON.stringify({
				...(tsconfig ? { extends: tsconfig } : {}),
				compilerOptions: {
					...(tsconfig
						? {}
						: {
								strict: true,
								target: "es2022",
								module: "esnext",
								moduleResolution: "bundler",
								skipLibCheck: true,
							}),
					// A composite config roots its files at its own directory,
					// which is this temporary one
					rootDir: path.parse(file).root,
				},
				files: [file],
				include: [],
			}),
		);

		const result = spawnSync(
			process.execPath,
			[tsc, "--noEmit", "--pretty", "false", "-p", configPath],
			{ cwd, encoding: "utf8" },
		);
		if (result.error) {
			throw result.error;
		}

		return parseTscOutput(
			`${result.stdout}${result.stderr}`,
			result.status ?? 1,
			path.relative(cwd, file),
		);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
}

function parseTscOutput(
	output: string,
	status: number,
	file: string,
): CheckDiagnostic[] {
	const diagnostics: CheckDiagnostic[] = [];

	for (const line of output.split(/\r?\n/)) {
		const located = LOCATED_ERROR.exec(line);
		const global = located ? undefined : GLOBAL_ERROR.exec(line);

		if (located) {
			diagnostics.push(
				typescriptDiagnostic(
					`${located[1]}:${located[2]}`,
					located[3]!,
					located[4]!,
				),
			);
		} else if (global) {
			diagnostics.push(typescriptDiagnostic(file, global[1]!, global[2]!));
		} else if (/^\s/.test(line) && diagnostics.length > 0) {
			// An indented line continues the previous message
			diagnostics[diagnostics.length - 1]!.message += `\n${line.trim()}`;
		}
	}

	// `tsc` failed without reporting a diagnostic, like when it crashed
	if (status !== 0 && diagnostics.length === 0) {
		diagnostics.push({
			code: "typescript",
			severity: "error",
			message: output.trim() || `tsc exited with code ${status}.`,
			path: file,
		});
	}

	return diagnostics;
}

function typescriptDiagnostic(
	location: string,
	tsCode: string,
	message: string,
): CheckDiagnostic {
	return {
		code: "typescript",
		severity: "error",
		message: `${tsCode}: ${message}`,
		path: location,
	};
}
