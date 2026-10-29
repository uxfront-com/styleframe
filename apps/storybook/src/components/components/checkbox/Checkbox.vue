<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { checkbox, checkboxField } from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		color?: "light" | "dark" | "neutral";
		size?: "sm" | "md" | "lg";
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		invalid?: boolean;
		label?: string;
	}>(),
	{
		size: "md",
	},
);

const fieldRef = ref<HTMLInputElement | null>(null);

const wrapperClasses = computed(() => checkbox({ size: props.size }));
const fieldClasses = computed(() =>
	checkboxField({ color: props.color, size: props.size }),
);

function syncIndeterminate() {
	if (fieldRef.value) {
		fieldRef.value.indeterminate = Boolean(props.indeterminate);
	}
}

// HTML ignores `readonly` on a checkbox, so a read-only box cancels the click
// that would toggle it, whether it comes from the box, its label or Space.
function onClick(event: MouseEvent) {
	if (props.readonly) {
		event.preventDefault();
	}
}

onMounted(syncIndeterminate);
watch(() => props.indeterminate, syncIndeterminate);
</script>

<template>
	<label :class="wrapperClasses">
		<input
			ref="fieldRef"
			type="checkbox"
			:class="fieldClasses"
			:checked="checked"
			:disabled="disabled"
			:aria-readonly="readonly ? 'true' : undefined"
			:aria-invalid="invalid ? 'true' : undefined"
			@click="onClick"
		/>
		<span v-if="$slots.default || label"
			><slot>{{ label }}</slot></span
		>
	</label>
</template>
