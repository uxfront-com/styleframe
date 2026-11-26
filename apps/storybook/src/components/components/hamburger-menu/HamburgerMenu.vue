<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { hamburgerMenu } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		size?: "sm" | "md" | "lg";
		animation?:
			| "close"
			| "arrow-up"
			| "arrow-down"
			| "arrow-left"
			| "arrow-right"
			| "minus"
			| "plus";
		active?: boolean;
		disabled?: boolean;
		label?: string;
	}>(),
	{
		color: "neutral",
		size: "md",
		animation: "close",
		active: false,
		disabled: false,
		label: "Toggle menu",
	},
);

const emit = defineEmits<{
	"update:active": [value: boolean];
}>();

const internalActive = ref(props.active);

watch(
	() => props.active,
	(value) => {
		internalActive.value = value;
	},
);

const classes = computed(() =>
	hamburgerMenu({
		color: props.color,
		size: props.size,
		animation: props.animation,
		active: internalActive.value ? "true" : "false",
	}),
);

function toggle() {
	if (props.disabled) {return;}
	internalActive.value = !internalActive.value;
	emit("update:active", internalActive.value);
}
</script>

<template>
	<button
		type="button"
		:class="classes"
		:disabled="props.disabled"
		:aria-expanded="internalActive"
		:aria-label="props.label"
		@click="toggle"
	>
		<span class="hamburger-menu-inner" />
	</button>
</template>
