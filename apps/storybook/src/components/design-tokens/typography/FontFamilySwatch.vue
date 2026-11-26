<script setup lang="ts">
import { fontFamilySwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<span :class="['font-family-swatch__preview', fontFamilySwatch({ variant: value })]">
			The quick brown fox jumps over the lazy dog. 0123456789
		</span>
	</SwatchCard>
</template>
