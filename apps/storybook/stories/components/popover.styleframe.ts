import {
	usePopoverRecipe,
	usePopoverHeaderRecipe,
	usePopoverBodyRecipe,
	usePopoverFooterRecipe,
	usePopoverArrowRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize popover recipes
export const popover = usePopoverRecipe(s);
export const popoverHeader = usePopoverHeaderRecipe(s);
export const popoverBody = usePopoverBodyRecipe(s);
export const popoverFooter = usePopoverFooterRecipe(s);
export const popoverArrow = usePopoverArrowRecipe(s);

// Container styles for story layout
selector(".popover-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "flex-start",
});

selector(".popover-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".popover-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "flex-start",
});

selector(".popover-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

selector(".popover-wrapper", {
	position: "relative",
	display: "inline-flex",
	flexDirection: "column",
	alignItems: "center",
});

// Inline examples keep a readable width without inline styles.
selector(".popover-demo", {
	maxWidth: "25rem",
});

selector(".popover-demo-narrow", {
	maxWidth: "18.75rem",
});

// Room around the triggers, so each top-layer popover opens on its own side:
// above and below the first column, before the third and after the fifth.
selector(".popover-stage", {
	display: "grid",
	gridTemplateColumns: "auto 19rem auto @spacing.md auto",
	gridTemplateAreas: '"top . start . end" "bottom . start . end"',
	rowGap: "@spacing.md",
	justifyContent: "center",
	alignItems: "center",
	paddingBlock: "14rem",
	paddingInline: "@spacing.md",
});

// Each trigger anchors the popover it opens, per story, so stories that
// share the docs page don't share anchors.
for (const story of ["top-layer", "placements", "focus"]) {
	for (const placement of ["top", "bottom", "start", "end"]) {
		selector(`.popover-anchor-${story}-${placement}`, {
			anchorName: `--popover-anchor-${story}-${placement}`,
			gridArea: placement,
		});
		selector(`.popover-at-${story}-${placement}`, {
			positionAnchor: `--popover-anchor-${story}-${placement}`,
			width: "15rem",
		});
	}
}

selector(".popover-arrow-position", {
	bottom: "calc(@popover.arrow.size * -1)",
	left: "calc(50% - @popover.arrow.size)",
});

export default s;
