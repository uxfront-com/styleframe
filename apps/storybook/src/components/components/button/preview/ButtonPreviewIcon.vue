<script setup lang="ts">
defineProps<{
	name: "search" | "arrow";
}>();
</script>

<template>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<template v-if="name === 'search'">
			<circle cx="11" cy="11" r="7" />
			<path d="m20 20-4-4" />
		</template>
		<path v-else d="M5 12h14m-6-6 6 6-6 6" />
	</svg>
</template>
