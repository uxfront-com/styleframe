import {
	useTextareaRecipe,
	useTextareaPrefixRecipe,
	useTextareaSuffixRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize textarea recipes
export const textarea = useTextareaRecipe(s);
export const textareaPrefix = useTextareaPrefixRecipe(s);
export const textareaSuffix = useTextareaSuffixRecipe(s);

// Container styles for story layout
selector(".textarea-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".textarea-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".textarea-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "flex-start",
});

// A field with its visible label above it, and an optional message below.
selector(".textarea-stack", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.xs",
});

selector(".textarea-story-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.medium",
	color: "@color.text",
});

selector(".textarea-story-message", {
	margin: "0",
	fontSize: "@font-size.sm",
	color: "@color.text-weak",
});

selector(".textarea-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

export default s;
