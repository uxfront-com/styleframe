import type { Diagnostic } from "@styleframe/core";
import { consola } from "consola";
import type { PluginGlobalState } from "./state";

/**
 * Log each diagnostic as a warning, once per build: the plugin transpiles up
 * to three times per build (CSS, TypeScript, and type declarations), and each
 * pass returns the same diagnostics.
 */
export function reportDiagnostics(
	state: PluginGlobalState,
	diagnostics: Diagnostic[] = [],
	silent = false,
): void {
	for (const { code, path, message } of diagnostics) {
		const key = `${code} ${path}`;
		if (state.reportedDiagnostics.has(key)) continue;

		state.reportedDiagnostics.add(key);
		if (!silent) {
			consola.warn(`[styleframe] ${code} ${path}: ${message}`);
		}
	}
}
