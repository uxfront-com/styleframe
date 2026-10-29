<script setup lang="ts">
import Switch from "../Switch.vue";

const colors = ["neutral", "light", "dark"] as const;
const states = [
	{ label: "off", checked: false },
	{ label: "on", checked: true },
	{ label: "disabled", checked: false, disabled: true },
	{ label: "disabled on", checked: true, disabled: true },
	{ label: "read-only", checked: false, readonly: true },
	{ label: "read-only on", checked: true, readonly: true },
	{ label: "invalid", checked: false, invalid: true },
	{ label: "invalid on", checked: true, invalid: true },
] as const;
</script>

<template>
	<div class="switch-section">
		<div v-for="state in states" :key="state.label">
			<div class="switch-label">{{ state.label }}</div>
			<div class="switch-row">
				<Switch
					v-for="color in colors"
					:key="`${state.label}-${color}`"
					:color="color"
					:checked="state.checked"
					:disabled="'disabled' in state && state.disabled"
					:readonly="'readonly' in state && state.readonly"
					:invalid="'invalid' in state && state.invalid"
					:label="`${color}, ${state.label}`"
				/>
			</div>
		</div>
	</div>
</template>
