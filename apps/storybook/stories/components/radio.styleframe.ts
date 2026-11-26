import { useRadioRecipe, useRadioFieldRecipe, useRadioGroupRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize radio recipes
export const radio = useRadioRecipe(s);
export const radioField = useRadioFieldRecipe(s);
export const radioGroup = useRadioGroupRecipe(s);

// Container styles for story layout
selector(".radio-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".radio-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".radio-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	alignItems: "center",
});

selector(".radio-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "120px",
});

export default s;
