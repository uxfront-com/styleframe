<script setup lang="ts">
import { button, spinner, spinnerCircle } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?:
			| "primary"
			| "secondary"
			| "success"
			| "info"
			| "warning"
			| "error"
			| "light"
			| "dark"
			| "neutral";
		variant?: "solid" | "outline" | "soft" | "subtle" | "ghost" | "link";
		size?: "xs" | "sm" | "md" | "lg" | "xl";
		label?: string;
		disabled?: boolean;
		pressed?: boolean;
		expanded?: boolean;
		loading?: boolean;
		iconOnly?: boolean;
	}>(),
	{ size: "md", pressed: undefined, expanded: undefined },
);
</script>

<template>
	<button
		type="button"
		:class="button({ color: props.color, variant: props.variant, size: props.size })"
		:disabled="props.disabled"
		:aria-pressed="props.pressed"
		:aria-expanded="props.expanded"
		:aria-disabled="props.loading ? 'true' : undefined"
		:data-loading="props.loading ? '' : undefined"
		:data-size="props.size"
		:data-icon-only="props.iconOnly ? '' : undefined"
	>
		<span v-if="props.loading" :class="spinner({ size: 'auto' })" aria-hidden="true">
			<svg :class="spinnerCircle({ size: 'auto' })" viewBox="0 0 50 50">
				<circle cx="25" cy="25" r="20" />
			</svg>
		</span>
		<span v-if="$slots.leading" data-slot="leading" aria-hidden="true">
			<slot name="leading" />
		</span>
		<span data-slot="label">{{ props.label }}</span>
		<span v-if="$slots.trailing" data-slot="trailing" aria-hidden="true">
			<slot name="trailing" />
		</span>
	</button>
</template>
