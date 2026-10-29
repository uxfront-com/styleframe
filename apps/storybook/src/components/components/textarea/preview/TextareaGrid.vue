<script setup lang="ts">
import Textarea from "../Textarea.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["default", "soft", "ghost"] as const;
</script>

<template>
	<div class="textarea-section">
		<div v-for="variant in variants" :key="variant">
			<div class="textarea-label">{{ variant }}</div>
			<div class="textarea-row">
				<div
					v-for="color in colors"
					:key="`${variant}-${color}`"
					class="textarea-stack"
				>
					<label
						:for="`textarea-${variant}-${color}`"
						class="textarea-story-label"
					>
						{{ variant }} {{ color }}
					</label>
					<Textarea
						:id="`textarea-${variant}-${color}`"
						:color="color"
						:variant="variant"
						:rows="3"
						placeholder="A short note"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
