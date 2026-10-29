import { useTooltipRecipe, useTooltipArrowRecipe } from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();
const { selector } = s;

// Initialize tooltip recipes
export const tooltip = useTooltipRecipe(s);
export const tooltipArrow = useTooltipArrowRecipe(s);

// Container styles for story layout
selector(".tooltip-grid", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.md",
	padding: "@spacing.md",
	alignItems: "center",
});

selector(".tooltip-section", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.lg",
	padding: "@spacing.md",
});

selector(".tooltip-row", {
	display: "flex",
	flexWrap: "wrap",
	gap: "@spacing.sm",
	alignItems: "center",
});

selector(".tooltip-label", {
	fontSize: "@font-size.sm",
	fontWeight: "@font-weight.semibold",
	minWidth: "80px",
});

selector(".tooltip-wrapper", {
	position: "relative",
	display: "inline-flex",
	flexDirection: "column",
	alignItems: "center",
});

// Rich content in the freeform example, without inline styles.
selector(".tooltip-freeform", {
	display: "flex",
	flexDirection: "column",
	gap: "@spacing.2xs",
});

selector(".tooltip-freeform-text", {
	fontWeight: "@font-weight.normal",
});

// Room around the triggers, so each top-layer tooltip opens on its own side:
// above and below the first column, before the third and after the fifth.
selector(".tooltip-stage", {
	display: "grid",
	gridTemplateColumns: "auto 12rem auto @spacing.md auto",
	gridTemplateAreas: '"top . start . end" "bottom . start . end"',
	rowGap: "@spacing.3xl",
	justifyContent: "center",
	alignItems: "center",
	paddingBlock: "@spacing.3xl",
	paddingInline: "12rem",
});

// Each trigger anchors the tooltip it shows.
for (const placement of ["top", "bottom", "start", "end"]) {
	selector(`.tooltip-anchor-${placement}`, {
		anchorName: `--tooltip-anchor-${placement}`,
		gridArea: placement,
	});
	selector(`.tooltip-at-${placement}`, {
		positionAnchor: `--tooltip-anchor-${placement}`,
	});
}

selector(".tooltip-arrow-position", {
	bottom: "calc(@tooltip.arrow.size * -1)",
	left: "calc(50% - @tooltip.arrow.size)",
});

export default s;
