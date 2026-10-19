<script setup lang="ts">
import { computed, useSlots } from "vue";
import { textarea, textareaPrefix, textareaSuffix } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		variant?: "default" | "soft" | "ghost";
		size?: "sm" | "md" | "lg";
		resize?: "none" | "vertical" | "horizontal" | "both";
		invalid?: boolean;
		placeholder?: string;
		modelValue?: string;
		disabled?: boolean;
		readonly?: boolean;
		rows?: number;
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
			class="textarea-field"
			:rows="rows"
			:placeholder="placeholder"
			:value="modelValue"
			:disabled="disabled"
			:readonly="readonly"
			:aria-invalid="invalid || undefined"
			@input="onInput"
		/>
		<span v-if="slots.suffix" :class="suffixClasses">
			<slot name="suffix" />
		</span>
	</span>
</template>
