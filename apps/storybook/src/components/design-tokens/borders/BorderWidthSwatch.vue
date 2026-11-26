<script setup lang="ts">
import { borderWidthSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<div :class="['border-width-swatch__preview', borderWidthSwatch({ variant: value })]" />
	</SwatchCard>
</template>
