/**
 * Default background-attachment utility values matching Tailwind CSS.
 */
export const backgroundAttachmentValues = {
	fixed: "fixed",
	local: "local",
	scroll: "scroll",
} as const;

/**
 * Default background-clip utility values matching Tailwind CSS.
 */
export const backgroundClipValues = {
	border: "border-box",
	padding: "padding-box",
	content: "content-box",
	text: "text",
} as const;

/**
 * Default background-origin utility values matching Tailwind CSS.
 */
export const backgroundOriginValues = {
	border: "border-box",
	padding: "padding-box",
	content: "content-box",
} as const;

/**
 * Default background-position utility values matching Tailwind CSS.
 */
export const backgroundPositionValues = {
	bottom: "bottom",
	center: "center",
	left: "left",
	"left-bottom": "left bottom",
	"left-top": "left top",
	right: "right",
	"right-bottom": "right bottom",
	"right-top": "right top",
	top: "top",
} as const;

/**
 * Default background-repeat utility values matching Tailwind CSS.
 */
export const backgroundRepeatValues = {
	repeat: "repeat",
	"no-repeat": "no-repeat",
	"repeat-x": "repeat-x",
	"repeat-y": "repeat-y",
	round: "round",
	space: "space",
} as const;

/**
 * Default background-size utility values matching Tailwind CSS.
 */
export const backgroundSizeValues = {
	auto: "auto",
	cover: "cover",
	contain: "contain",
} as const;

/**
 * Default background-image utility values matching Tailwind CSS.
 */
export const backgroundImageValues = {
	none: "none",
	"gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
	"gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
	"gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
	"gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
	"gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
	"gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
	"gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
	"gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))",
} as const;
