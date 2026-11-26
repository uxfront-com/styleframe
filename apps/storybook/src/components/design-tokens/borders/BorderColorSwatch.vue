<script setup lang="ts">
import { borderColorSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<div :class="['border-color-swatch__preview', borderColorSwatch({ variant: value })]" />
	</SwatchCard>
</template>
