import {
	getLicenseKeyFromEnv,
	validateInstanceLicense,
} from "@styleframe/license";
import { transpile } from "@styleframe/transpiler";
import {
	generateShorteningMap,
	buildClassNameLookup,
} from "@styleframe/transpiler";
import { consola } from "consola";
import { reportDiagnostics } from "../diagnostics";
import type { PluginGlobalState } from "../state";
import type { Options } from "../types";

/**
 * Generate global CSS from the global instance.
 */
export async function generateGlobalCSS(
	state: PluginGlobalState,
	isBuild: boolean,
	options: Options,
): Promise<{ code: string }> {
	if (!state.globalInstance) {
		return { code: "/* Styleframe not initialized */" };
	}

	await validateInstanceLicense(state.globalInstance, {
		licenseKey: getLicenseKeyFromEnv() || "",
		environment: process.env.NODE_ENV || "development",
		isBuild,
	});

	const minifyConfig =
		typeof options.minify === "object" ? options.minify : undefined;
	const minify = isBuild && options.minify !== false;
	const minifyOptions = minify ? minifyConfig : undefined;

	if (minify && state.globalInstance) {
		const shortMap = generateShorteningMap(
			state.globalInstance.root,
			minifyOptions,
		);
		state.classNameLookup = buildClassNameLookup(
			state.globalInstance.root,
			shortMap,
		);
	}

	const result = await transpile(state.globalInstance, {
		type: "css",
		treeshake: true,
		...options.transpiler,
		scanner: !!options.scanner?.content?.length,
		minify,
		minifyOptions,
	});
	reportDiagnostics(state, result.diagnostics, options.silent);
	const css = result.files.map((f) => f.content).join("\n");

	if (!options.silent) {
		consola.success(`[styleframe] Built global CSS successfully.`);
	}

	return { code: css };
}
