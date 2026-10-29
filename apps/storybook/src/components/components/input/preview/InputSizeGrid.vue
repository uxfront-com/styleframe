<script setup lang="ts">
import Input from "../Input.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="input-section">
		<div v-for="size in sizes" :key="size" class="input-stack">
			<label :for="`input-${size}`" class="input-story-label">
				{{ sizeTitles[size] }}
			</label>
			<Input :id="`input-${size}`" :size="size" placeholder="Ada Lovelace" />
		</div>
	</div>
</template>
