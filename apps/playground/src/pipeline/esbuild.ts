// Vite resolves the `?url` import to the hashed asset URL at build time.
import esbuildWasmUrl from "esbuild-wasm/esbuild.wasm?url";
import * as esbuild from "esbuild-wasm/esm/browser";

let initPromise: Promise<typeof esbuild> | null = null;

export function getEsbuild(): Promise<typeof esbuild> {
	if (!initPromise) {
		initPromise = esbuild.initialize({ wasmURL: esbuildWasmUrl, worker: true }).then(() => esbuild);
	}
	return initPromise;
}
