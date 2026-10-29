import { useSwitchRecipe, useSwitchFieldRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize switch recipes
export const switchRecipe = useSwitchRecipe(s);
export const switchField = useSwitchFieldRecipe(s);

// Container styles for story layout
selector(".switch-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".switch-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".switch-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	alignItems: "center",
});

selector(".switch-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "120px",
});

selector(".switch-stack", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.xs",
	alignItems: "flex-start",
});

selector(".switch-story-message", {
	margin: "0",
	fontSize: "@font-size.sm",
	color: "@color.text",
});

export default s;
