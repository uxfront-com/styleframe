import type { Styleframe } from "@styleframe/core";
import { useUtilitiesPreset } from "./useUtilitiesPreset";
import type { UtilitiesPresetConfig } from "./useUtilitiesPreset";

/**
 * TailwindCSS-style shorthand name mappings.
 *
 * Maps default utility names (kebab-case) to shorter Tailwind-style names.
 * Only includes entries where the name actually changes.
 */
export const shorthandNames: Record<string, string> = {
	// Spacing
	margin: "m",
	"margin-top": "mt",
	"margin-right": "mr",
	"margin-bottom": "mb",
	"margin-left": "ml",
	"margin-inline": "mx",
	"margin-block": "my",
	"margin-inline-start": "ms",
	"margin-inline-end": "me",
	padding: "p",
	"padding-top": "pt",
	"padding-right": "pr",
	"padding-bottom": "pb",
	"padding-left": "pl",
	"padding-inline": "px",
	"padding-block": "py",
	"padding-inline-start": "ps",
	"padding-inline-end": "pe",

	// Sizing
	width: "w",
	"min-width": "min-w",
	"max-width": "max-w",
	height: "h",
	"min-height": "min-h",
	"max-height": "max-h",

	// Typography
	"font-size": "text",
	"font-weight": "font",
	"line-height": "leading",
	"letter-spacing": "tracking",
	"text-decoration-line": "decoration",
	"text-decoration-color": "decoration-color",
	"text-decoration-style": "decoration-style",
	"text-decoration-thickness": "decoration-thickness",
	"text-underline-offset": "underline-offset",
	"text-indent": "indent",
	"vertical-align": "align",
	"word-break": "break",
	"list-style-image": "list-image",
	"list-style-type": "list",

	// Layout
	"z-index": "z",
	"inset-inline-start": "start",
	"inset-inline-end": "end",
	"aspect-ratio": "aspect",
	isolation: "isolate",
	"box-sizing": "box",
	"box-decoration-break": "box-decoration",

	// Flexbox & Grid
	"flex-grow": "grow",
	"flex-shrink": "shrink",
	"flex-basis": "basis",
	"justify-content": "justify",
	"align-items": "items",
	"align-self": "self",
	"grid-template-columns": "grid-cols",
	"grid-template-rows": "grid-rows",
	"grid-column": "col",
	"grid-column-start": "col-start",
	"grid-column-end": "col-end",
	"grid-row": "row",
	"grid-row-start": "row-start",
	"grid-row-end": "row-end",
	"grid-auto-flow": "grid-flow",
	"grid-auto-columns": "auto-cols",
	"grid-auto-rows": "auto-rows",

	// Borders
	"border-width": "border",
	"border-x-width": "border-x",
	"border-y-width": "border-y",
	"border-top-width": "border-t",
	"border-right-width": "border-r",
	"border-bottom-width": "border-b",
	"border-left-width": "border-l",
	"border-inline-start-width": "border-s",
	"border-inline-end-width": "border-e",
	"border-top-color": "border-t-color",
	"border-right-color": "border-r-color",
	"border-bottom-color": "border-b-color",
	"border-left-color": "border-l-color",
	"border-inline-start-color": "border-s-color",
	"border-inline-end-color": "border-e-color",
	"border-radius": "rounded",
	"border-radius-top": "rounded-t",
	"border-radius-right": "rounded-r",
	"border-radius-bottom": "rounded-b",
	"border-radius-left": "rounded-l",
	"border-radius-start": "rounded-s",
	"border-radius-end": "rounded-e",
	"border-top-left-radius": "rounded-tl",
	"border-top-right-radius": "rounded-tr",
	"border-bottom-right-radius": "rounded-br",
	"border-bottom-left-radius": "rounded-bl",
	"border-start-start-radius": "rounded-ss",
	"border-start-end-radius": "rounded-se",
	"border-end-end-radius": "rounded-ee",
	"border-end-start-radius": "rounded-es",
	"outline-width": "outline",

	// Effects
	"box-shadow": "shadow",
	"box-shadow-color": "shadow-color",
	"background-blend-mode": "bg-blend",
	"mix-blend-mode": "mix-blend",

	// Backgrounds
	"background-color": "bg",
	"background-attachment": "bg-attachment",
	"background-clip": "bg-clip",
	"background-origin": "bg-origin",
	"background-position": "bg-position",
	"background-repeat": "bg-repeat",
	"background-size": "bg-size",
	"gradient-from": "from",
	"gradient-via": "via",
	"gradient-to": "to",

	// Transforms
	"transform-origin": "origin",
	"backface-visibility": "backface",

	// Transitions & Animation
	"transition-property": "transition",
	"transition-duration": "duration",
	"transition-timing-function": "ease",
	"transition-delay": "delay",

	// Tables
	"table-layout": "table",
	"caption-side": "caption",

	// Interactivity
	"accent-color": "accent",
	"caret-color": "caret",
	"color-scheme": "scheme",
	"scroll-behavior": "scroll",
	"scroll-snap-align": "snap",
	"scroll-snap-stop": "snap-stop",
	"scroll-snap-type": "snap-type",
	"scroll-margin": "scroll-m",
	"scroll-margin-x": "scroll-mx",
	"scroll-margin-y": "scroll-my",
	"scroll-margin-top": "scroll-mt",
	"scroll-margin-right": "scroll-mr",
	"scroll-margin-bottom": "scroll-mb",
	"scroll-margin-left": "scroll-ml",
	"scroll-margin-inline-start": "scroll-ms",
	"scroll-margin-inline-end": "scroll-me",
	"scroll-padding": "scroll-p",
	"scroll-padding-x": "scroll-px",
	"scroll-padding-y": "scroll-py",
	"scroll-padding-top": "scroll-pt",
	"scroll-padding-right": "scroll-pr",
	"scroll-padding-bottom": "scroll-pb",
	"scroll-padding-left": "scroll-pl",
	"scroll-padding-inline-start": "scroll-ps",
	"scroll-padding-inline-end": "scroll-pe",
	"touch-action": "touch",
	"user-select": "select",
};

/**
 * A preset that uses TailwindCSS-style shorthand class names.
 *
 * This is a convenience wrapper around `useUtilitiesPreset` that applies
 * Tailwind-style naming conventions (e.g., `._m:sm` instead of `._margin:sm`).
 *
 * Custom names provided in `config.names` will override the shorthand defaults.
 *
 * @example
 * ```typescript
 * import { styleframe } from "styleframe";
 * import { useShorthandUtilitiesPreset } from "@styleframe/theme";
 *
 * const s = styleframe();
 * const utilities = useShorthandUtilitiesPreset(s);
 *
 * // Now generates: ._m:sm, ._p:md, ._w:full, ._rounded:lg, etc.
 * ```
 */
export function useShorthandUtilitiesPreset(
	s: Styleframe,
	config: UtilitiesPresetConfig = {},
) {
	return useUtilitiesPreset(s, {
		...config,
		names: { ...shorthandNames, ...config.names },
	});
}
