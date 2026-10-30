<script setup lang="ts">
import { computed } from "vue";
import { inputDate, inputDateSegment } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "default" | "soft" | "ghost";
		size?: "sm" | "md" | "lg";
		invalid?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		value?: string;
		separator?: string;
	}>(),
	{
		variant: "default",
		size: "md",
		value: "12/31/2026",
		separator: "/",
	},
);

const wrapperClasses = computed(() =>
	inputDate({
		color: props.color,
		variant: props.variant,
		size: props.size,
		invalid: props.invalid ? "true" : "false",
		disabled: props.disabled ? "true" : "false",
		readonly: props.readonly ? "true" : "false",
	}),
);

const segmentClasses = computed(() => inputDateSegment({ size: props.size }));

const segments = computed(() => props.value.split(props.separator));

// The default value is month, day, year, in that order.
const segmentLabels = ["Month", "Day", "Year"];

const focusable = computed(() => !props.disabled && !props.readonly);
</script>

<template>
	<div :class="wrapperClasses" role="group" aria-label="Date input">
		<span class="input-date-field">
			<template v-for="(segment, index) in segments" :key="index">
				<span
					:class="segmentClasses"
					:tabindex="focusable ? 0 : undefined"
					role="spinbutton"
					:aria-label="segmentLabels[index]"
					:aria-disabled="disabled || undefined"
					>{{ segment }}</span
				>
				<span
					v-if="index < segments.length - 1"
					class="input-date-separator"
					aria-hidden="true"
					>{{ separator }}</span
				>
			</template>
		</span>
	</div>
</template>
