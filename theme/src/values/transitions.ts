/**
 * Default transition-property utility values matching Tailwind CSS.
 */
export const transitionPropertyValues = {
	none: "none",
	all: "all",
	default:
		"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
	colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
	opacity: "opacity",
	shadow: "box-shadow",
	transform: "transform",
} as const;

/**
 * Default transition-behavior utility values matching Tailwind CSS.
 */
export const transitionBehaviorValues = {
	normal: "normal",
	"allow-discrete": "allow-discrete",
} as const;

/**
 * Default animation utility values matching Tailwind CSS.
 */
export const animationValues = {
	none: "none",
	spin: "spin 1s linear infinite",
	ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
	pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
	bounce: "bounce 1s infinite",
} as const;
