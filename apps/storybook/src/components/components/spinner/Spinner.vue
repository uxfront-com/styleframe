<script setup lang="ts">
import { computed } from "vue";
import { spinner, spinnerCircle, spinnerText } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "primary" | "light" | "dark" | "neutral";
		size?: "auto" | "sm" | "md" | "lg" | "inherit";
		label?: string;
	}>(),
	{},
);

const spinnerClasses = computed(() =>
	spinner({
		color: props.color,
		size: props.size,
	}),
);

const circleClasses = computed(() =>
	spinnerCircle({
		size: props.size,
	}),
);

const textClasses = computed(() =>
	spinnerText({
		size: props.size,
	}),
);
</script>

<template>
	<span :class="spinnerClasses" role="status">
		<svg :class="circleClasses" viewBox="0 0 50 50" aria-hidden="true">
			<circle cx="25" cy="25" r="20" />
		</svg>
		<span v-if="props.label" :class="textClasses">{{ props.label }}</span>
		<slot />
	</span>
</template>
