import { useOtpRecipe, useOtpCellRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize otp recipes
export const otp = useOtpRecipe(s);
export const otpCell = useOtpCellRecipe(s);

// Container styles for story layout
selector(".otp-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".otp-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".otp-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.lg",
	alignItems: "flex-start",
});

selector(".otp-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	marginBottom: "@spacing.sm",
});

selector(".otp-caption", {
	fontSize: "@font-size.xs",
	fontWeight: "@font-weight.normal",
	color: "@color.text-weak",
	marginBottom: "@spacing.sm",
});

// light keeps one color in both themes and is for light surfaces, and dark
// for dark ones, so a story shows each on its own surface in either theme.
selector(".otp-surface-light, .otp-surface-dark", {
	display: "flex",
	padding: "@spacing.sm",
	borderRadius: "@border-radius.md",
});

selector(".otp-surface-light", {
	background: "@color.white",
});

selector(".otp-surface-dark", {
	background: "@color.gray-900",
});

export default s;
