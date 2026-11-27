import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { recipe } = s;

export const breakpointSwatchTrack = recipe({
	name: "breakpoint-swatch-track",
	base: {
		display: "flex",
		overflow: "hidden",
		width: "100%",
		height: "@0.25",
		borderRadius: "@border-radius.sm",
		background: "@color.gray-200",
		"&:dark": {
			background: "@color.gray-800",
		},
	},
});

export const breakpointSwatchBar = recipe({
	name: "breakpoint-swatch-bar",
	base: {
		height: "100%",
		borderRadius: "@border-radius.sm",
		background: "@color.primary",
	},
});

export default s;
