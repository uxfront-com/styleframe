<script setup lang="ts">
import Textarea from "../Textarea.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="textarea-section">
		<div v-for="size in sizes" :key="size" class="textarea-stack">
			<label :for="`textarea-${size}`" class="textarea-story-label">
				{{ sizeTitles[size] }}
			</label>
			<Textarea
				:id="`textarea-${size}`"
				:size="size"
				:rows="3"
				placeholder="A short note"
			/>
		</div>
	</div>
</template>
