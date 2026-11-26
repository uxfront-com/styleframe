<script setup lang="ts">
import { letterSpacingSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<span :class="['letter-spacing-swatch__preview', letterSpacingSwatch({ variant: value })]">
			Letter Spacing
		</span>
	</SwatchCard>
</template>
