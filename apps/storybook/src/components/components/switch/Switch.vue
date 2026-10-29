<script setup lang="ts">
import { computed } from "vue";
import { switchRecipe, switchField } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		size?: "sm" | "md" | "lg";
		checked?: boolean;
		disabled?: boolean;
		/** Can be focused but not flipped, and says so with `aria-readonly`. */
		readonly?: boolean;
		/** Sets `aria-invalid`, while an error message describes the switch. */
		invalid?: boolean;
		/** The `id` of the hint or error message that describes the switch. */
		describedby?: string;
		label?: string;
	}>(),
	{
		size: "md",
	},
);

const wrapperClasses = computed(() => switchRecipe({ size: props.size }));
const fieldClasses = computed(() =>
	switchField({ color: props.color, size: props.size }),
);

// A checkbox has no `readonly` of its own, so a read-only switch cancels the
// click that would flip it.
function onClick(event: MouseEvent) {
	if (props.readonly) event.preventDefault();
}
</script>

<template>
	<label :class="wrapperClasses">
		<input
			type="checkbox"
			role="switch"
			:class="fieldClasses"
			:checked="checked"
			:disabled="disabled"
			:aria-readonly="readonly || undefined"
			:aria-invalid="invalid || undefined"
			:aria-describedby="describedby"
			@click="onClick"
		/>
		<span v-if="$slots.default || label"
			><slot>{{ label }}</slot></span
		>
	</label>
</template>
