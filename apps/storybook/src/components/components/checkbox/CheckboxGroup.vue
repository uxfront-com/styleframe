<script setup lang="ts">
import { computed, useId } from "vue";
import { checkboxGroup } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		orientation?: "vertical" | "horizontal";
		size?: "sm" | "md" | "lg";
		/** The question the checkboxes answer, shown as the fieldset's legend. */
		legend?: string;
		/** An error message, after the group. While it's set, the group is `aria-invalid`. */
		error?: string;
		/** Disables the fieldset, and with it every checkbox. */
		disabled?: boolean;
	}>(),
	{},
);

const errorId = `${useId()}-error`;

const classes = computed(() =>
	checkboxGroup({
		orientation: props.orientation,
		size: props.size,
	}),
);
</script>

<template>
	<div>
		<fieldset
			:class="classes"
			:aria-describedby="error ? errorId : undefined"
			:aria-invalid="error ? 'true' : undefined"
			:disabled="disabled"
		>
			<legend v-if="legend">{{ legend }}</legend>
			<slot />
		</fieldset>
		<p v-if="error" :id="errorId">{{ error }}</p>
	</div>
</template>
