<script setup lang="ts">
import { computed } from "vue";
import {
	colorPicker,
	colorPickerSelector,
	colorPickerThumb,
	colorPickerTrack,
} from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		size?: "xs" | "sm" | "md" | "lg" | "xl";
		disabled?: boolean;
	}>(),
	{
		size: "md",
	},
);

const rootClasses = computed(() => colorPicker({ size: props.size }));
const selectorClasses = computed(() =>
	colorPickerSelector({ size: props.size }),
);
const trackClasses = computed(() => colorPickerTrack({ size: props.size }));
const thumbClasses = computed(() => colorPickerThumb());

const disabledAttr = computed(() => (props.disabled ? "" : undefined));
</script>

<template>
	<div :class="rootClasses" :data-disabled="disabledAttr" role="group" aria-label="Color picker">
		<div :class="selectorClasses">
			<div :class="thumbClasses" :data-disabled="disabledAttr" aria-hidden="true" />
		</div>
		<div :class="trackClasses">
			<div :class="thumbClasses" :data-disabled="disabledAttr" aria-hidden="true" />
		</div>
	</div>
</template>
