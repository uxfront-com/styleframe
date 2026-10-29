import {
	useModalRecipe,
	useModalHeaderRecipe,
	useModalBodyRecipe,
	useModalFooterRecipe,
	useModalOverlayRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize modal recipes
export const modal = useModalRecipe(s);
export const modalHeader = useModalHeaderRecipe(s);
export const modalBody = useModalBodyRecipe(s);
export const modalFooter = useModalFooterRecipe(s);
export const modalOverlay = useModalOverlayRecipe(s);

// Container styles for story layout
selector(".modal-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".modal-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".modal-row", {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
	gap: "@spacing.sm",
	alignItems: "start",
});

/**
 * A preview "stage" that dims like the modal overlay, so a grid of panels can
 * render side by side. It isn't the overlay itself, since an overlay on the
 * page stops it scrolling.
 */
selector(".modal-stage", {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "@spacing.lg",
	background: "rgba(0, 0, 0, 0.75)",
	borderRadius: "@border-radius.lg",
});

// The title is an <h2>: reset its margin and size it like the panel's text.
selector(".modal-title", {
	margin: "0",
	fontSize: "@font-size.lg",
	fontWeight: "@font-weight.semibold",
});

selector(".modal-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

export default s;
