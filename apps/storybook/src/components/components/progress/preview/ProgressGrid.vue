<script setup lang="ts">
import Progress from "../Progress.vue";
import ProgressBar from "../ProgressBar.vue";

const colors = [
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"light",
	"dark",
	"neutral",
] as const;
</script>

<template>
	<div class="progress-section">
		<div v-for="color in colors" :key="color">
			<div class="progress-label">{{ color }}</div>
			<div class="progress-row">
				<Progress :color="color === 'light' || color === 'dark' ? color : undefined" :value="65">
					<ProgressBar :color="color" :value="65" />
				</Progress>
			</div>
		</div>
	</div>
</template>
