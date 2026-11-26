import { useBreadcrumbItemRecipe, useBreadcrumbRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

export const breadcrumb = useBreadcrumbRecipe(s);
export const breadcrumbItem = useBreadcrumbItemRecipe(s);

// Layout selectors for story grid previews
selector(".breadcrumb-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".breadcrumb-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".breadcrumb-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "flex-start",
});

selector(".breadcrumb-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

export default s;
