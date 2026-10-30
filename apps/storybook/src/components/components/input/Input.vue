<script setup lang="ts">
import { computed, useSlots } from "vue";
import { input, inputPrefix, inputSuffix } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "default" | "soft" | "ghost";
		size?: "sm" | "md" | "lg";
		invalid?: boolean;
		placeholder?: string;
		modelValue?: string;
		disabled?: boolean;
		readonly?: boolean;
		type?: string;
		/** The native input's `id`, for the `for` of its `<label>`. */
		id?: string;
		/** The `id` of the hint or error message that describes the input. */
		describedby?: string;
	}>(),
	{
		type: "text",
		size: "md",
	},
);

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const slots = useSlots();

const wrapperClasses = computed(() =>
	input({
		color: props.color,
		variant: props.variant,
		size: props.size,
		invalid: props.invalid ? "true" : "false",
		disabled: props.disabled ? "true" : "false",
		readonly: props.readonly ? "true" : "false",
	}),
);

const prefixClasses = computed(() => inputPrefix({ size: props.size }));
const suffixClasses = computed(() => inputSuffix({ size: props.size }));

function onInput(event: Event) {
	emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
	<span :class="wrapperClasses">
		<span v-if="slots.prefix" :class="prefixClasses">
			<slot name="prefix" />
		</span>
		<input
			:id="id"
			class="input-field"
			:type="type"
			:placeholder="placeholder"
			:value="modelValue"
			:disabled="disabled"
			:readonly="readonly"
			:aria-invalid="invalid || undefined"
			:aria-describedby="describedby"
			@input="onInput"
		/>
		<span v-if="slots.suffix" :class="suffixClasses">
			<slot name="suffix" />
		</span>
	</span>
</template>
