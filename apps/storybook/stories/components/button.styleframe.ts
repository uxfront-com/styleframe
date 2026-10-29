import { useButtonRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize button recipe
export const button = useButtonRecipe(s);

// Container styles for story layout
selector(".button-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "center",
});

selector(".button-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".button-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "center",
});

// The light color is made for dark surfaces and the dark color for light
// surfaces, in either theme.
selector(".button-surface-dark, .button-surface-light", {
	display: "inline-flex",
	padding: "@spacing.xs",
	borderRadius: "@border-radius.md",
});

selector(".button-surface-dark", {
	background: "@color.gray-900",
});

selector(".button-surface-light", {
	background: "@color.white",
});

selector(".button-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

export default s;
