<script setup lang="ts">
import { computed } from "vue";
import { contextMenuSubTrigger } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		size?: "sm" | "md" | "lg";
		open?: boolean;
	}>(),
	{
		open: false,
	},
);

const classes = computed(() =>
	contextMenuSubTrigger({
		color: props.color,
		variant: props.variant,
		size: props.size,
		open: props.open ? "true" : "false",
	}),
);
</script>

<template>
	<button
		type="button"
		role="menuitem"
		:aria-haspopup="true"
		:aria-expanded="props.open ? 'true' : 'false'"
		:class="classes"
	>
		<slot />
		<span class="context-menu-sub-trigger-icon" aria-hidden="true">&rsaquo;</span>
	</button>
</template>
