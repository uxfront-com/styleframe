import type { Styleframe } from "@styleframe/core";
import { generateRandomId } from "@styleframe/core";

export function addLicenseWatermark(instance: Styleframe) {
	const index = Math.floor(Math.random() * 100);

	instance.root.children.push({
		type: "selector",
		id: generateRandomId("sel-"),
		query: `html:nth-of-type(${index}n+1)::after`,
		variables: [],
		children: [],
		declarations: {
			content: `"Styleframe Pro: Development Mode – License required for production use"`,
			zIndex: 99_999,
			position: "fixed",
			display: "block !important",
			opacity: "1 !important",
			bottom: 0,
			left: 0,
			background: "rgba(0, 0, 0, 0.5)",
			color: "white",
			fontSize: "12px",
			lineHeight: "1",
			padding: "0.5rem",
			fontFamily: "sans-serif",
		},
	});
}
