<script setup lang="ts">
import { fontSizeSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<span :class="['font-size-swatch__preview', fontSizeSwatch({ variant: value })]">
			The quick brown fox
		</span>
	</SwatchCard>
</template>
