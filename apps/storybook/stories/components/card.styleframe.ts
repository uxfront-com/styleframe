import {
	useCardRecipe,
	useCardHeaderRecipe,
	useCardMediaRecipe,
	useCardBodyRecipe,
	useCardFooterRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize card recipes
export const card = useCardRecipe(s);
export const cardHeader = useCardHeaderRecipe(s);
export const cardMedia = useCardMediaRecipe(s);
export const cardBody = useCardBodyRecipe(s);
export const cardFooter = useCardFooterRecipe(s);

// Container styles for story layout
selector(".card-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".card-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".card-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "flex-start",
});

selector(".card-preview", {
	maxWidth: "300px",
});

selector(".card-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

export default s;
