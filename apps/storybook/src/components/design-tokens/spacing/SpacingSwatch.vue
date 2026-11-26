<script setup lang="ts">
import { spacingSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<div :class="['spacing-swatch__preview', spacingSwatch({ variant: value })]" />
	</SwatchCard>
</template>
