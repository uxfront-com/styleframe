<script setup lang="ts">
import { computed } from "vue";
import { radio, radioField } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		size?: "sm" | "md" | "lg";
		checked?: boolean;
		disabled?: boolean;
		name?: string;
		label?: string;
	}>(),
	{
		size: "md",
	},
);

const wrapperClasses = computed(() => radio({ size: props.size }));
const fieldClasses = computed(() =>
	radioField({ color: props.color, size: props.size }),
);
</script>

<template>
	<label :class="wrapperClasses">
		<input
			type="radio"
			:class="fieldClasses"
			:name="name"
			:checked="checked"
			:disabled="disabled"
		/>
		<span v-if="$slots.default || label"><slot>{{ label }}</slot></span>
	</label>
</template>
