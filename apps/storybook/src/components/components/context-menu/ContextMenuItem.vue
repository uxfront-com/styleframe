<script setup lang="ts">
import { computed } from "vue";
import { contextMenuItem } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		size?: "sm" | "md" | "lg";
		inset?: boolean;
		destructive?: boolean;
		disabled?: boolean;
	}>(),
	{
		inset: false,
		destructive: false,
		disabled: false,
	},
);

const classes = computed(() =>
	contextMenuItem({
		color: props.color,
		variant: props.variant,
		size: props.size,
		inset: props.inset ? "true" : "false",
		destructive: props.destructive ? "true" : "false",
	}),
);
</script>

<template>
	<button type="button" role="menuitem" :class="classes" :disabled="props.disabled">
		<slot />
	</button>
</template>
