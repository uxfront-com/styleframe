<script setup lang="ts">
import { computed } from "vue";
import { breakpointSwatchBar, breakpointSwatchTrack } from "virtual:styleframe";
import SwatchRow from "../../primitives/SwatchRow.vue";

const props = defineProps<{
	name: string;
	value: string;
	width: number;
}>();

const maxBreakpoint = 1440;

const percentage = computed(() =>
	Math.max(10, (props.width / maxBreakpoint) * 100),
);
</script>

<template>
	<SwatchRow :name="name" :value="value" uppercase>
		<div
			:class="breakpointSwatchTrack()"
			role="progressbar"
			:aria-label="`${name} breakpoint`"
			:aria-valuenow="Math.round(percentage)"
			:aria-valuemin="0"
			:aria-valuemax="100"
		>
			<div :class="breakpointSwatchBar()" :style="{ width: `${percentage}%` }" />
		</div>
	</SwatchRow>
</template>
