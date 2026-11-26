<script setup lang="ts">
import Select from "../Select.vue";
import SelectChip from "../SelectChip.vue";
import SelectOption from "../SelectOption.vue";
import SelectPanel from "../SelectPanel.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="select-section">
		<div v-for="size in sizes" :key="size">
			<div class="select-caption">{{ sizeTitles[size] }}</div>
			<div class="select-row">
				<div v-for="color in colors" :key="`${size}-${color}`" class="select-wrapper">
					<Select :color="color" :size="size" variant="solid" :open="true">
						<SelectChip :color="color" :size="size">Apple</SelectChip>
					</Select>
					<SelectPanel :color="color" :size="size" variant="solid">
						<SelectOption :color="color" :size="size" variant="solid" :selected="true">
							Apple
						</SelectOption>
						<SelectOption :color="color" :size="size" variant="solid"> Banana </SelectOption>
						<SelectOption :color="color" :size="size" variant="solid"> Cherry </SelectOption>
					</SelectPanel>
				</div>
			</div>
		</div>
	</div>
</template>
