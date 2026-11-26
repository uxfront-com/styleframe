<script setup lang="ts">
import Select from "../Select.vue";
import SelectChip from "../SelectChip.vue";
import SelectPanel from "../SelectPanel.vue";
import SelectLabel from "../SelectLabel.vue";
import SelectOption from "../SelectOption.vue";
import SelectSeparator from "../SelectSeparator.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "ghost"] as const;
const panelVariant = (v: string) => (v === "ghost" ? "subtle" : v);
</script>

<template>
	<div class="select-section">
		<div v-for="variant in variants" :key="variant">
			<div class="select-caption">{{ variant }}</div>
			<div class="select-row">
				<div v-for="color in colors" :key="`${variant}-${color}`" class="select-wrapper">
					<Select :color="color" :variant="variant" :open="true">
						<SelectChip :color="color" size="md">Apple</SelectChip>
						<SelectChip :color="color" size="md">Banana</SelectChip>
					</Select>
					<SelectPanel :color="color" :variant="panelVariant(variant)" size="md">
						<SelectLabel :color="color" size="md">Fruits</SelectLabel>
						<SelectOption :color="color" :variant="panelVariant(variant)" size="md" :selected="true"
							>Apple</SelectOption
						>
						<SelectOption :color="color" :variant="panelVariant(variant)" size="md" :selected="true"
							>Banana</SelectOption
						>
						<SelectOption :color="color" :variant="panelVariant(variant)" size="md"
							>Cherry</SelectOption
						>
						<SelectSeparator :color="color" />
						<SelectOption :color="color" :variant="panelVariant(variant)" size="md" :disabled="true"
							>Durian (out of stock)</SelectOption
						>
					</SelectPanel>
				</div>
			</div>
		</div>
	</div>
</template>
