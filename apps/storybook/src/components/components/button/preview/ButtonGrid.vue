<script setup lang="ts">
import Button from "../Button.vue";

const colors = [
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"neutral",
] as const;
const variants = [
	"solid",
	"outline",
	"soft",
	"subtle",
	"ghost",
	"link",
] as const;
</script>

<template>
	<div class="button-section">
		<div v-for="variant in variants" :key="variant">
			<div class="button-label">{{ variant }}</div>
			<div class="button-row">
				<Button
					v-for="color in colors"
					:key="`${variant}-${color}`"
					:color="color"
					:variant="variant"
					:label="color"
				/>
				<span class="button-surface-dark">
					<Button color="light" :variant="variant" label="light" />
				</span>
				<span class="button-surface-light">
					<Button color="dark" :variant="variant" label="dark" />
				</span>
			</div>
		</div>
	</div>
</template>
