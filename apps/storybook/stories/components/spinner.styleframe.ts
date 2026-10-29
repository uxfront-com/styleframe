import {
	useSpinnerRecipe,
	useSpinnerCircleRecipe,
	useSpinnerTextRecipe,
	useSpinnerOverlayRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

export const spinner = useSpinnerRecipe(s);
export const spinnerCircle = useSpinnerCircleRecipe(s);
export const spinnerText = useSpinnerTextRecipe(s);
export const spinnerOverlay = useSpinnerOverlayRecipe(s);

selector(".spinner-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "center",
});

selector(".spinner-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".spinner-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "center",
});

selector(".spinner-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

selector(".spinner-text-sample", {
	margin: "0",
	fontSize: "@font-size.md",
});

selector(".spinner-heading-sample", {
	margin: "0",
	fontSize: "@font-size.2xl",
});

// A box the overlay fills, so a story shows the backdrop without covering the page.
selector(".spinner-backdrop", {
	position: "relative",
	width: "@spacing.3xl",
	height: "@spacing.3xl",
});

selector(".spinner-backdrop > .spinner-overlay", {
	position: "absolute",
});

export default s;
