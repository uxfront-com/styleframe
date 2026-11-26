import { useAvatarRecipe, useAvatarGroupRecipe, useAvatarBadgeRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize avatar recipes
export const avatar = useAvatarRecipe(s);
export const avatarGroup = useAvatarGroupRecipe(s);
export const avatarBadge = useAvatarBadgeRecipe(s);

// Container styles for story layout
selector(".avatar-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "center",
});

selector(".avatar-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".avatar-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	alignItems: "center",
});

selector(".avatar-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

export default s;
