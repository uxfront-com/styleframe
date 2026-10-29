<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import Button from "../../button/Button.vue";
import Popover from "../Popover.vue";
import PopoverHeader from "../PopoverHeader.vue";
import PopoverBody from "../PopoverBody.vue";
import PopoverArrow from "../PopoverArrow.vue";
import PopoverTitle from "../PopoverTitle.vue";
import PopoverDescription from "../PopoverDescription.vue";

type Placement = "top" | "bottom" | "start" | "end";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		placements?: Placement[];
		open?: boolean;
		/** Keeps ids and anchor names apart when several stories share a page. */
		name?: "top-layer" | "placements" | "focus";
	}>(),
	{
		placements: () => ["top"],
		name: "top-layer",
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

// Several popovers stay open side by side as `manual` ones, while a single
// one light-dismisses as `auto`, like the reference implementation.
const mode = props.placements.length > 1 ? "manual" : "auto";

onMounted(() => {
	if (!props.open) return;
	for (const el of stage.value?.querySelectorAll<HTMLElement>("[popover]") ??
		[]) {
		el.showPopover();
	}
});
</script>

<template>
	<div ref="stage" class="popover-stage">
		<template v-for="placement in props.placements" :key="placement">
			<Button
				:class="`popover-anchor-${props.name}-${placement}`"
				color="neutral"
				variant="outline"
				:label="`${labels[placement]} the button`"
				:popovertarget="`popover-${props.name}-${placement}`"
				aria-haspopup="dialog"
			/>
			<Popover
				:id="`popover-${props.name}-${placement}`"
				:class="`popover-at-${props.name}-${placement}`"
				:color="props.color"
				:variant="props.variant"
				:placement="placement"
				:popover="mode"
				role="dialog"
				:aria-labelledby="`popover-${props.name}-${placement}-title`"
			>
				<PopoverArrow
					:color="props.color"
					:variant="props.variant"
					:placement="placement"
				/>
				<PopoverHeader :color="props.color" :variant="props.variant">
					<PopoverTitle :id="`popover-${props.name}-${placement}-title`"
						>Filters</PopoverTitle
					>
				</PopoverHeader>
				<PopoverBody>
					<PopoverDescription>
						Opens {{ labels[placement].toLowerCase() }} its button, and flips
						when there's no room.
					</PopoverDescription>
				</PopoverBody>
			</Popover>
		</template>
	</div>
</template>
