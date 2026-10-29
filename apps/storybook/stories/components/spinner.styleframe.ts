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
	display: "flex",
	alignItems: "center",
	gap: "@spacing.xs",
	margin: "0",
	fontSize: "@font-size.md",
});

selector(".spinner-heading-sample", {
	display: "flex",
	alignItems: "center",
	gap: "@spacing.xs",
	margin: "0",
	fontSize: "@font-size.2xl",
});

export default s;
