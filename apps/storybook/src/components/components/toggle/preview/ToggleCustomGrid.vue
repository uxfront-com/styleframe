<script setup lang="ts">
import Toggle from "../Toggle.vue";
import FieldGroup from "../../field-group/FieldGroup.vue";

// A custom font-weight picker — outline toggles joined into a segmented control
// via the field-group recipe, each cell showing "Aa" at its weight + a label.
const weights = [
	{ key: "light", label: "Light" },
	{ key: "normal", label: "Normal" },
	{ key: "medium", label: "Medium" },
	{ key: "bold", label: "Bold" },
] as const;
</script>

<template>
	<FieldGroup>
		<Toggle v-for="w in weights" :key="w.key" variant="outline" :pressed="w.key === 'normal'">
			<span class="toggle-weight">
				<span :class="['toggle-weight-glyph', `-${w.key}`]">Aa</span>
				<span class="toggle-weight-label">{{ w.label }}</span>
			</span>
		</Toggle>
	</FieldGroup>
</template>
