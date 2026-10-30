import {
	useCheckboxRecipe,
	useCheckboxFieldRecipe,
	useCheckboxGroupRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize checkbox recipes
export const checkbox = useCheckboxRecipe(s);
export const checkboxField = useCheckboxFieldRecipe(s);
export const checkboxGroup = useCheckboxGroupRecipe(s);

// Container styles for story layout
selector(".checkbox-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".checkbox-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".checkbox-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	alignItems: "center",
});

selector(".checkbox-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "120px",
});

selector(".checkbox-narrow", {
	maxWidth: "16rem",
});

export default s;
