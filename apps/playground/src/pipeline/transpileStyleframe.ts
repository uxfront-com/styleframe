import type { Styleframe } from "@styleframe/core";
import { transpile } from "@styleframe/transpiler";

export interface StyleframeOutput {
	css: string;
	ts: string;
}

export async function transpileStyleframe(
	instance: Styleframe,
): Promise<StyleframeOutput> {
	const output = await transpile(instance, {
		treeshake: false,
		scanner: false,
	});
	let css = "";
	let ts = "";
	for (const file of output.files) {
		if (file.name.endsWith(".css")) {
			css = file.content;
		} else if (file.name.endsWith(".ts")) {
			ts = file.content;
		}
	}
	return { css, ts };
}
