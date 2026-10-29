<script setup lang="ts">
import Checkbox from "../Checkbox.vue";

const colors = ["neutral", "light", "dark"] as const;
const states: {
	label: string;
	checked?: boolean;
	indeterminate?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	invalid?: boolean;
}[] = [
	{ label: "unchecked" },
	{ label: "checked", checked: true },
	{ label: "indeterminate", indeterminate: true },
	{ label: "disabled", disabled: true },
	{ label: "disabled checked", checked: true, disabled: true },
	{ label: "read-only", readonly: true },
	{ label: "read-only checked", checked: true, readonly: true },
	{ label: "invalid", invalid: true },
	{ label: "invalid checked", checked: true, invalid: true },
];
</script>

<template>
	<div class="checkbox-section">
		<div v-for="state in states" :key="state.label">
			<div class="checkbox-label">{{ state.label }}</div>
			<div class="checkbox-row">
				<Checkbox
					v-for="color in colors"
					:key="`${state.label}-${color}`"
					:color="color"
					:checked="state.checked"
					:indeterminate="state.indeterminate"
					:disabled="state.disabled"
					:readonly="state.readonly"
					:invalid="state.invalid"
					:label="color"
				/>
			</div>
		</div>
	</div>
</template>
