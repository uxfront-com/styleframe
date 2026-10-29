<script setup lang="ts">
import { computed } from "vue";
import { modal } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		size?: "sm" | "md" | "lg";
		fullscreen?: boolean;
	}>(),
	{},
);

const classes = computed(() =>
	modal({
		color: props.color,
		variant: props.variant,
		size: props.size,
		fullscreen: props.fullscreen ? "true" : "false",
	}),
);
</script>

<template>
	<div :class="classes" role="dialog">
		<slot />
	</div>
</template>
