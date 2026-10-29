<script lang="ts">
// Counts across every story on a page, since each one mounts its own app.
let stages = 0;
</script>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { tooltip, tooltipArrow } from "virtual:styleframe";
import Button from "../../button/Button.vue";

type Placement = "top" | "bottom" | "start" | "end";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		placements?: Placement[];
		open?: boolean;
	}>(),
	{
		placements: () => ["top"],
		open: true,
	},
);

const labels: Record<Placement, string> = {
	top: "Above",
	bottom: "Below",
	start: "Before",
	end: "After",
};

const stage = useTemplateRef<HTMLElement>("stage");
// Unique per story, since the docs page renders several of them at once.
const id = `tooltip-stage-${++stages}`;

// Like the reference implementation, each tooltip is a `manual` popover, shown
// while its trigger has focus.
function tooltipOf(event: FocusEvent) {
	const id = (event.target as HTMLElement).getAttribute("aria-describedby");
	return id ? document.getElementById(id) : null;
}

const show = (event: FocusEvent) => tooltipOf(event)?.showPopover();
const hide = (event: FocusEvent) => tooltipOf(event)?.hidePopover();

onMounted(() => {
	if (!props.open) return;
	for (const el of stage.value?.querySelectorAll<HTMLElement>("[popover]") ??
		[]) {
		el.showPopover();
	}
});
</script>

<template>
	<div ref="stage" class="tooltip-stage">
		<template v-for="placement in props.placements" :key="placement">
			<Button
				:class="`tooltip-anchor-${placement}`"
				color="neutral"
				variant="outline"
				:label="`${labels[placement]} the button`"
				:aria-describedby="`${id}-tooltip-${placement}`"
				@focus="show"
				@blur="hide"
			/>
			<span
				:id="`${id}-tooltip-${placement}`"
				:class="[
					tooltip({
						color: props.color,
						variant: props.variant,
						placement,
					}),
					`tooltip-at-${placement}`,
				]"
				role="tooltip"
				popover="manual"
			>
				Opens {{ labels[placement].toLowerCase() }} its button
				<span
					:class="
						tooltipArrow({
							color: props.color,
							variant: props.variant,
							placement,
						})
					"
					aria-hidden="true"
				/>
			</span>
		</template>
	</div>
</template>
