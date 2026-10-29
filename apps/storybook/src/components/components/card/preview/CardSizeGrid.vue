<script setup lang="ts">
import Card from "../Card.vue";
import CardHeader from "../CardHeader.vue";
import CardBody from "../CardBody.vue";
import CardFooter from "../CardFooter.vue";
import CardTitle from "../CardTitle.vue";
import CardDescription from "../CardDescription.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="card-section">
		<div v-for="size in sizes" :key="size">
			<div class="card-label">{{ size }}</div>
			<div class="card-row">
				<Card
					v-for="color in colors"
					:key="`${size}-${color}`"
					:color="color"
					:size="size"
					class="card-preview"
				>
					<CardHeader :color="color" :size="size">
						<CardTitle
							>{{ sizeTitles[size] }}
							{{ color.charAt(0).toUpperCase() + color.slice(1) }}</CardTitle
						>
					</CardHeader>
					<CardBody :size="size">
						<CardDescription
							>This is a {{ size }} {{ color }} card.</CardDescription
						>
					</CardBody>
					<CardFooter :color="color" :size="size"> Footer content </CardFooter>
				</Card>
			</div>
		</div>
	</div>
</template>
