<script setup lang="ts">
import Calendar from "../Calendar.vue";

const variants = ["solid", "outline", "soft", "subtle"] as const;
</script>

<template>
	<div class="calendar-stories-grid">
		<div v-for="variant in variants" :key="variant" class="calendar-stories-section">
			<div class="calendar-stories-label">{{ variant }}</div>
			<Calendar
				:variant="variant"
				selected="2026-06-18"
				range-start="2026-06-08"
				range-end="2026-06-12"
			/>
		</div>
	</div>
</template>
