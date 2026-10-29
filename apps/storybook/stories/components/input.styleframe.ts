import {
	useInputRecipe,
	useInputPrefixRecipe,
	useInputSuffixRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize input recipes
export const input = useInputRecipe(s);
export const inputPrefix = useInputPrefixRecipe(s);
export const inputSuffix = useInputSuffixRecipe(s);

// Container styles for story layout
selector(".input-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".input-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".input-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "center",
});

// A field with its visible label above it, and an optional message below.
selector(".input-stack", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.xs",
});

selector(".input-story-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.medium",
	color: "@color.text",
});

selector(".input-story-message", {
	margin: "0",
	fontSize: "@font-size.sm",
	color: "@color.text-weak",
});

selector(".input-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

export default s;
