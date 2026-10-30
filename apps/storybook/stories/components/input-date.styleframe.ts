import {
	useInputDateRecipe,
	useInputDateSegmentRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize input-date recipes
export const inputDate = useInputDateRecipe(s);
export const inputDateSegment = useInputDateSegmentRecipe(s);

// Container styles for story layout
selector(".input-date-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".input-date-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".input-date-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "center",
});

selector(".input-date-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

// light keeps one color in both themes and is for light surfaces, and dark
// for dark ones, so a story shows each on its own surface in either theme.
selector(".input-date-surface-light, .input-date-surface-dark", {
	display: "flex",
	padding: "@spacing.sm",
	borderRadius: "@border-radius.md",
});

selector(".input-date-surface-light", {
	background: "@color.white",
});

selector(".input-date-surface-dark", {
	background: "@color.gray-900",
});

export default s;
