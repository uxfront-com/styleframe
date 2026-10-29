<script setup lang="ts">
import Input from "../Input.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["default", "soft", "ghost"] as const;
</script>

<template>
	<div class="input-section">
		<div v-for="variant in variants" :key="variant">
			<div class="input-label">{{ variant }}</div>
			<div class="input-row">
				<div
					v-for="color in colors"
					:key="`${variant}-${color}`"
					class="input-stack"
				>
					<label :for="`input-${variant}-${color}`" class="input-story-label">
						{{ variant }} {{ color }}
					</label>
					<Input
						:id="`input-${variant}-${color}`"
						:color="color"
						:variant="variant"
						placeholder="Ada Lovelace"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
