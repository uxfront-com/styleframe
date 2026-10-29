<script setup lang="ts">
defineProps<{
	href?: string;
}>();
</script>

<template>
	<h3 class="card-title _margin:0">
		<a v-if="href" :href="href"><slot /></a>
		<slot v-else />
	</h3>
</template>
