import { DEFAULT_INDENT } from "../../constants";
import { DTS_HEADER, VIRTUAL_CSS_MODULE_ID, VIRTUAL_TS_MODULE_ID } from "./constants";

/**
 * Wraps the top-level typed exports (the `styleframe.d.ts` body) into a
 * self-contained ambient `declare module "virtual:styleframe"` block.
 *
 * The leading {@link DTS_HEADER} is dropped (it is re-emitted once at the top of
 * the shims file) and every remaining non-empty line is indented one level so it
 * reads naturally inside the module body. Reusing the exact same exports the
 * root consumer produces guarantees `shims.d.ts` never drifts from
 * `styleframe.d.ts`.
 */
function wrapAsAmbientModule(typesContent: string): string {
	const body = typesContent
		.split("\n")
		.filter((line, index) => !(index === 0 && line === DTS_HEADER))
		.map((line) => (line.length > 0 ? `${DEFAULT_INDENT}${line}` : line))
		.join("\n")
		.replace(/\n+$/, "");

	return [`declare module "${VIRTUAL_TS_MODULE_ID}" {`, body, "}"].join("\n");
}

/**
 * Generates the self-contained ambient shims for the virtual modules.
 *
 * Emits a `declare module "virtual:styleframe"` block carrying the full typed
 * exports (so non-Vue consumers resolve it with zero `paths` config) followed by
 * the `virtual:styleframe.css` string shim. The typed exports are passed in as
 * `typesContent` — the same string written to `styleframe.d.ts`.
 */
export function generateShims(typesContent: string): string {
	const i = DEFAULT_INDENT;

	return `${[
		DTS_HEADER,
		wrapAsAmbientModule(typesContent),
		"",
		`declare module "${VIRTUAL_CSS_MODULE_ID}" {`,
		`${i}const css: string;`,
		`${i}export default css;`,
		"}",
	].join("\n")}\n`;
}
