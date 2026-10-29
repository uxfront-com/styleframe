<script setup lang="ts">
import Card from "../Card.vue";
import CardHeader from "../CardHeader.vue";
import CardBody from "../CardBody.vue";
import CardFooter from "../CardFooter.vue";
import CardTitle from "../CardTitle.vue";
import CardDescription from "../CardDescription.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
</script>

<template>
	<div class="card-section">
		<div v-for="variant in variants" :key="variant">
			<div class="card-label">{{ variant }}</div>
			<div class="card-row">
				<Card
					v-for="color in colors"
					:key="`${variant}-${color}`"
					:color="color"
					:variant="variant"
					class="card-preview"
				>
					<CardHeader :color="color" :variant="variant">
						<CardTitle
							>{{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
							{{ color.charAt(0).toUpperCase() + color.slice(1) }}</CardTitle
						>
					</CardHeader>
					<CardBody>
						<CardDescription
							>This is a {{ variant }} {{ color }} card.</CardDescription
						>
					</CardBody>
					<CardFooter :color="color" :variant="variant">
						Footer content
					</CardFooter>
				</Card>
			</div>
		</div>
	</div>
</template>
