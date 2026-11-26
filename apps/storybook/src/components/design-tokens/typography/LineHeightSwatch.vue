<script setup lang="ts">
import { lineHeightSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();

const sampleText =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.";
</script>

<template>
	<SwatchCard :name="name">
		<span :class="['line-height-swatch__preview', lineHeightSwatch({ variant: value })]">
			{{ sampleText }}
		</span>
	</SwatchCard>
</template>
