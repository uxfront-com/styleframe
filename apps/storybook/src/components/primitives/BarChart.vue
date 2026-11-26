<script setup lang="ts">
defineProps<{
	heights: Array<string>;
}>();
</script>

<template>
	<div class="bar-chart">
		<div
			v-for="(height, index) in heights"
			:key="index"
			class="bar-chart__bar"
			:style="{ height }"
		/>
	</div>
</template>
