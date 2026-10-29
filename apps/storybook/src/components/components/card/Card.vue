<script setup lang="ts">
import { computed } from "vue";
import { card } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		size?: "sm" | "md" | "lg";
	}>(),
	{},
);

const classes = computed(() =>
	card({
		color: props.color,
		variant: props.variant,
		size: props.size,
	}),
);
</script>

<template>
	<article :class="classes">
		<slot />
	</article>
</template>
