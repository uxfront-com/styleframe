<script setup lang="ts">
import Spinner from "../Spinner.vue";

const sizes = ["auto", "sm", "md", "lg", "em"] as const;
</script>

<template>
	<div class="spinner-section">
		<div v-for="size in sizes" :key="size">
			<div class="spinner-label">{{ size }}</div>
			<div class="spinner-row">
				<div v-if="size === 'auto'" class="_width:[100px] _height:[100px]">
					<Spinner :size="size" />
				</div>
				<p v-else-if="size === 'em'" class="spinner-text-sample">
					<Spinner :size="size" /> Saving draft
				</p>
				<Spinner v-else :size="size" />
			</div>
		</div>
	</div>
</template>
