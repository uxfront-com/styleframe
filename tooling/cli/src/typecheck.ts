import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, rm, rmdir, writeFile } from "node:fs/promises";
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

function findUp(directory: string, name: string): string | undefined {
	for (let dir = directory; ; dir = path.dirname(dir)) {
		const candidate = path.join(dir, name);
		if (existsSync(candidate)) {
			return candidate;
		}
		if (dir === path.dirname(dir)) {
			return undefined;
		}
	}
}

/**
 * The temporary tsconfig that type-checks one file: it extends the project's
 * tsconfig, or uses `strict` defaults when there's none, and roots the
 * program at the file alone.
 */
export function createTypecheckConfig(
	file: string,
	tsconfig: string | undefined,
) {
	return {
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
			// Build info would overwrite the project's own, or land in its
			// `outDir`, since `--noEmit` doesn't stop `tsc` from writing it
			incremental: false,
			composite: false,
			// TypeScript roots files at the config's directory by default,
			// which is the temporary one
			rootDir: path.parse(file).root,
		},
		files: [file],
		include: [],
	};
}

const LOCATED_ERROR = /^(.+)\((\d+),\d+\): (?:error|warning) (TS\d+): (.*)$/;
const GLOBAL_ERROR = /^(?:error|warning) (TS\d+): (.*)$/;

/**
 * Type-check one config file, and none of the project's other files, with
 * the compiler options of the nearest `tsconfig.json`. It writes a temporary
 * tsconfig that extends it and removes it afterwards.
 */
export async function typecheck(
	file: string,
	tsc: string,
	cwd = process.cwd(),
): Promise<CheckDiagnostic[]> {
	const tsconfig = findUp(path.dirname(file), "tsconfig.json");

	// TypeScript resolves `types` and `@types` from the config's directory,
	// so the temporary config sits in the project's `node_modules/.cache`,
	// which resolves the same packages as the project's own directory
	const nodeModules = findUp(path.dirname(tsconfig ?? file), "node_modules");
	const cache = nodeModules ? path.join(nodeModules, ".cache") : tmpdir();
	const createdCache = !existsSync(cache);
	await mkdir(cache, { recursive: true });
	const directory = await mkdtemp(path.join(cache, "styleframe-typecheck-"));

	try {
		const configPath = path.join(directory, "tsconfig.json");
		await writeFile(
			configPath,
			JSON.stringify(createTypecheckConfig(file, tsconfig)),
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
		if (createdCache) {
			// Left alone when something else wrote to it meanwhile
			await rmdir(cache).catch(() => {});
		}
	}
}

export function parseTscOutput(
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
