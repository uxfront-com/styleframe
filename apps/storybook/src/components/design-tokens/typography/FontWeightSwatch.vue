<script setup lang="ts">
import { fontWeightSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<span :class="['font-weight-swatch__preview', fontWeightSwatch({ variant: value })]">
			The quick brown fox jumps over the lazy dog
		</span>
	</SwatchCard>
</template>
