<script setup lang="ts">
import { boxShadowSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<div :class="['box-shadow-swatch__preview', boxShadowSwatch({ variant: value })]" />
	</SwatchCard>
</template>
