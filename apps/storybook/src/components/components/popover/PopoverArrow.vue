<script setup lang="ts">
import { computed } from "vue";
import { popoverArrow } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		placement?: "top" | "bottom" | "start" | "end";
	}>(),
	{},
);

const classes = computed(() =>
	popoverArrow({
		color: props.color,
		variant: props.variant,
		placement: props.placement,
	}),
);
</script>

<template>
	<div :class="classes" />
</template>
