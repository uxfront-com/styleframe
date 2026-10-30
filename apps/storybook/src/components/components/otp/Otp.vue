<script setup lang="ts">
import { computed } from "vue";
import { otp, otpCell } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "default" | "soft" | "ghost";
		size?: "sm" | "md" | "lg";
		invalid?: boolean;
		disabled?: boolean;
		length?: number;
		value?: string;
		placeholder?: string;
	}>(),
	{
		variant: "default",
		size: "md",
		length: 6,
		value: "",
		placeholder: "",
	},
);

const containerClasses = computed(() => otp({ size: props.size }));

const cellClasses = computed(() =>
	otpCell({
		color: props.color,
		variant: props.variant,
		size: props.size,
		invalid: props.invalid ? "true" : "false",
		disabled: props.disabled ? "true" : "false",
	}),
);

const characters = computed(() =>
	Array.from({ length: props.length }, (_, index) => props.value[index] ?? ""),
);
</script>

<template>
	<div :class="containerClasses" role="group" aria-label="One-time password">
		<input
			v-for="(char, index) in characters"
			:key="index"
			:class="cellClasses"
			type="text"
			inputmode="numeric"
			autocomplete="one-time-code"
			maxlength="1"
			:value="char"
			:aria-label="`Digit ${index + 1} of ${length}`"
			:placeholder="placeholder"
			:disabled="disabled"
			:aria-invalid="invalid || undefined"
		/>
	</div>
</template>
