<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { toggle } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "solid" | "outline" | "ghost";
		size?: "sm" | "md" | "lg";
		pressed?: boolean;
		disabled?: boolean;
		label?: string;
	}>(),
	{
		pressed: false,
	},
);

// `aria-pressed` is the toggle's ON state. The recipe styles the result; the
// component owns the state and flips it on click (kept in sync with the prop so
// preview grids can render fixed pressed/unpressed cells).
const isPressed = ref(props.pressed);
watch(
	() => props.pressed,
	(value) => {
		isPressed.value = value;
	},
);

const classes = computed(() =>
	toggle({ color: props.color, variant: props.variant, size: props.size }),
);

function handleClick() {
	if (props.disabled) {return;}
	isPressed.value = !isPressed.value;
}
</script>

<template>
	<button
		type="button"
		:class="classes"
		:aria-pressed="isPressed"
		:disabled="disabled"
		@click="handleClick"
	>
		<slot>{{ label }}</slot>
	</button>
</template>
