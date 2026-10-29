<script setup lang="ts">
import { computed, useSlots } from "vue";
import { textarea, textareaPrefix, textareaSuffix } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "default" | "soft" | "ghost";
		size?: "sm" | "md" | "lg";
		resize?: "none" | "vertical" | "horizontal" | "both";
		/** Grows with its text, up to `maxRows`. */
		autogrow?: boolean;
		/** The rows an auto-growing textarea stops at, then scrolls. */
		maxRows?: number;
		invalid?: boolean;
		placeholder?: string;
		modelValue?: string;
		disabled?: boolean;
		readonly?: boolean;
		rows?: number;
		/** The native textarea's `id`, for the `for` of its `<label>`. */
		id?: string;
		/** The `id` of the hint or error message that describes the textarea. */
		describedby?: string;
	}>(),
	{
		size: "md",
		rows: 4,
	},
);

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const slots = useSlots();

const wrapperClasses = computed(() =>
	textarea({
		color: props.color,
		variant: props.variant,
		size: props.size,
		resize: props.resize,
		autogrow: props.autogrow ? "true" : "false",
		invalid: props.invalid ? "true" : "false",
		disabled: props.disabled ? "true" : "false",
		readonly: props.readonly ? "true" : "false",
	}),
);

const prefixClasses = computed(() => textareaPrefix({ size: props.size }));
const suffixClasses = computed(() => textareaSuffix({ size: props.size }));

function onInput(event: Event) {
	emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
}
</script>

<template>
	<span :class="wrapperClasses">
		<span v-if="slots.prefix" :class="prefixClasses">
			<slot name="prefix" />
		</span>
		<textarea
			:id="id"
			class="textarea-field"
			dir="auto"
			:rows="rows"
			:data-max-rows="maxRows"
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
