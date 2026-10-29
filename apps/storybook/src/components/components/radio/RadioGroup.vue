<script setup lang="ts">
import { computed, useId } from "vue";
import { radioGroup } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		orientation?: "vertical" | "horizontal";
		size?: "sm" | "md" | "lg";
		/** The question the radios answer, shown as the fieldset's legend. */
		legend?: string;
		/** A hint for the whole group, linked with `aria-describedby`. */
		hint?: string;
		/** An error message. While it's set, the group is `aria-invalid`. */
		error?: string;
		/** Disables the fieldset, and with it every radio. */
		disabled?: boolean;
	}>(),
	{},
);

const id = useId();
const legendId = `${id}-legend`;
const hintId = `${id}-hint`;
const errorId = `${id}-error`;

const classes = computed(() =>
	radioGroup({
		orientation: props.orientation,
		size: props.size,
	}),
);

const describedby = computed(
	() =>
		[props.hint && hintId, props.error && errorId].filter(Boolean).join(" ") ||
		undefined,
);
</script>

<template>
	<fieldset
		:class="classes"
		role="radiogroup"
		:aria-labelledby="legend ? legendId : undefined"
		:aria-describedby="describedby"
		:aria-invalid="error ? 'true' : undefined"
		:disabled="disabled"
	>
		<legend v-if="legend" :id="legendId">{{ legend }}</legend>
		<p v-if="hint" :id="hintId" data-slot="hint">{{ hint }}</p>
		<slot />
		<p v-if="error" :id="errorId" data-slot="error">{{ error }}</p>
	</fieldset>
</template>
