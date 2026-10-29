<script setup lang="ts">
import { computed } from "vue";
import { tooltip, tooltipArrow } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		size?: "sm" | "md" | "lg";
		label?: string;
	}>(),
	{},
);

const classes = computed(() =>
	tooltip({
		color: props.color,
		variant: props.variant,
		size: props.size,
	}),
);

const arrowClasses = computed(() =>
	tooltipArrow({
		color: props.color,
		variant: props.variant,
	}),
);
</script>

<template>
	<div class="tooltip-wrapper">
		<span :class="classes">
			<slot>{{ props.label }}</slot>
		</span>
		<span :class="[arrowClasses, 'tooltip-arrow-position']" />
	</div>
</template>
