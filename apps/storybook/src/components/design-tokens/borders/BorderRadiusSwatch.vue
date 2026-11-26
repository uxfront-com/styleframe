<script setup lang="ts">
import { borderRadiusSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<div :class="['border-radius-swatch__preview', borderRadiusSwatch({ variant: value })]" />
	</SwatchCard>
</template>
