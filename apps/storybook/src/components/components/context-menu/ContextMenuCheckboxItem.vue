<script setup lang="ts">
import { computed } from "vue";
import { contextMenuItem } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "soft" | "subtle";
		size?: "sm" | "md" | "lg";
		checked?: boolean;
		disabled?: boolean;
	}>(),
	{
		checked: false,
		disabled: false,
	},
);

// Checkbox & radio rows reuse the item recipe with `inset` to reserve the
// leading indicator gutter; the `.context-menu-item-indicator` slot holds the
// check, revealed only when checked.
const classes = computed(() =>
	contextMenuItem({
		color: props.color,
		variant: props.variant,
		size: props.size,
		inset: "true",
	}),
);
</script>

<template>
	<button
		type="button"
		role="menuitemcheckbox"
		:aria-checked="props.checked ? 'true' : 'false'"
		:class="classes"
		:disabled="props.disabled"
	>
		<span v-if="props.checked" class="context-menu-item-indicator" aria-hidden="true">
			&checkmark;
		</span>
		<slot />
	</button>
</template>
