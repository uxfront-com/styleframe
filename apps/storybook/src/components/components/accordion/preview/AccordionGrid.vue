<script setup lang="ts">
import Accordion from "../Accordion.vue";
import AccordionContent from "../AccordionContent.vue";
import AccordionItem from "../AccordionItem.vue";
import AccordionTrigger from "../AccordionTrigger.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "ghost"] as const;

const capitalize = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1);
</script>

<template>
	<div class="accordion-section">
		<div v-for="variant in variants" :key="variant">
			<div class="accordion-label">{{ variant }}</div>
			<div class="accordion-row">
				<Accordion
					v-for="color in colors"
					:key="`${variant}-${color}`"
					class="accordion-demo"
					:color="color"
					:variant="variant"
					default-value="item-1"
				>
					<AccordionItem value="item-1">
						<AccordionTrigger> {{ capitalize(variant) }} {{ capitalize(color) }} </AccordionTrigger>
						<AccordionContent>
							The first panel opens by default so the surface is visible.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>Second panel</AccordionTrigger>
						<AccordionContent> Click a trigger to expand or collapse its panel. </AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	</div>
</template>
