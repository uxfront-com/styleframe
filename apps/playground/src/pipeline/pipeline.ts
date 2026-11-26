import { buildSrcdoc } from "./buildSrcdoc";
import type { BuildSrcdocResult } from "./buildSrcdoc";
import { bundlePreview } from "./bundlePreview";
import { evalStyleframeFile, evalUserConfig } from "./evalUserConfig";
import { scanAndRegisterUtilities } from "./scanAndRegisterUtilities";
import type { ScanResult } from "./scanAndRegisterUtilities";
import { transformTs } from "./transformTs";
import { transpileStyleframe } from "./transpileStyleframe";

/** `*.styleframe.ts` extension files are evaluated, not bundled or scanned. */
export function isStyleframeFile(path: string): boolean {
	return path.endsWith(".styleframe.ts");
}

export interface PipelineInput {
	files: Record<string, string>;
	configPath: string;
	entryPath: string;
}

export interface PipelineSuccess {
	ok: true;
	css: string;
	runtimeTs: string;
	srcdoc: string;
	scan: ScanResult;
	revoke: () => void;
}

export interface PipelineFailure {
	ok: false;
	stage:
		| "config-transform"
		| "config-eval"
		| "styleframe"
		| "scan"
		| "transpile"
		| "bundle"
		| "assemble";
	error: Error;
}

export type PipelineResult = PipelineSuccess | PipelineFailure;

function toError(value: unknown): Error {
	if (value instanceof Error) {
		return value;
	}
	return new Error(String(value));
}

export async function runPipeline(input: PipelineInput): Promise<PipelineResult> {
	const configSource = input.files[input.configPath] ?? "";

	let compiledConfig: string;
	try {
		compiledConfig = await transformTs(configSource);
	} catch (error) {
		return { ok: false, stage: "config-transform", error: toError(error) };
	}

	let instance: Awaited<ReturnType<typeof evalUserConfig>>;
	try {
		instance = await evalUserConfig(compiledConfig);
	} catch (error) {
		return { ok: false, stage: "config-eval", error: toError(error) };
	}

	// Auto-include every *.styleframe.ts file: each extends the shared instance.
	try {
		const styleframePaths = Object.keys(input.files)
			.filter((path) => path !== input.configPath && isStyleframeFile(path))
			.sort();
		for (const path of styleframePaths) {
			const compiled = await transformTs(input.files[path] ?? "");
			evalStyleframeFile(compiled, instance);
		}
	} catch (error) {
		return { ok: false, stage: "styleframe", error: toError(error) };
	}

	let scan: ScanResult;
	try {
		const sources = Object.entries(input.files)
			.filter(([path]) => path !== input.configPath && !isStyleframeFile(path))
			.map(([filePath, content]) => ({ content, filePath }));
		scan = scanAndRegisterUtilities(instance, sources);
	} catch (error) {
		return { ok: false, stage: "scan", error: toError(error) };
	}

	let transpiled: Awaited<ReturnType<typeof transpileStyleframe>>;
	try {
		transpiled = await transpileStyleframe(instance);
	} catch (error) {
		return { ok: false, stage: "transpile", error: toError(error) };
	}

	let bundled: Awaited<ReturnType<typeof bundlePreview>>;
	try {
		bundled = await bundlePreview({
			files: input.files,
			entryPath: input.entryPath,
			configPath: input.configPath,
			runtimeTs: transpiled.ts,
		});
	} catch (error) {
		return { ok: false, stage: "bundle", error: toError(error) };
	}

	let built: BuildSrcdocResult;
	try {
		built = buildSrcdoc({
			css: transpiled.css + bundled.css,
			bundleJs: bundled.bundleJs,
			reactIife: bundled.reactIife,
		});
	} catch (error) {
		return { ok: false, stage: "assemble", error: toError(error) };
	}

	return {
		ok: true,
		css: transpiled.css,
		runtimeTs: transpiled.ts,
		srcdoc: built.srcdoc,
		scan,
		revoke: built.revoke,
	};
}

export function debounce<Args extends Array<unknown>>(
	fn: (...args: Args) => void,
	waitMs: number,
): (...args: Args) => void {
	let handle: ReturnType<typeof setTimeout> | null = null;
	return (...args: Args) => {
		if (handle !== null) {
			clearTimeout(handle);
		}
		handle = setTimeout(() => {
			handle = null;
			fn(...args);
		}, waitMs);
	};
}
