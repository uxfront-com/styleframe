<script setup lang="ts">
import Accordion from "../Accordion.vue";
import AccordionContent from "../AccordionContent.vue";
import AccordionItem from "../AccordionItem.vue";
import AccordionTrigger from "../AccordionTrigger.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="accordion-section">
		<div v-for="size in sizes" :key="size">
			<div class="accordion-label">{{ size }}</div>
			<div class="accordion-row">
				<Accordion
					v-for="color in colors"
					:key="`${size}-${color}`"
					class="accordion-demo"
					:color="color"
					:size="size"
					default-value="item-1"
				>
					<AccordionItem value="item-1">
						<AccordionTrigger> {{ sizeTitles[size] }} {{ color }} </AccordionTrigger>
						<AccordionContent> Padding and type scale with the size axis. </AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>Second panel</AccordionTrigger>
						<AccordionContent>
							Collapsed content for the {{ size }} {{ color }} accordion.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	</div>
</template>
