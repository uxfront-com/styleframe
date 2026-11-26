<script setup lang="ts">
import { borderStyleSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<div :class="['border-style-swatch__preview', borderStyleSwatch({ variant: value })]" />
	</SwatchCard>
</template>
