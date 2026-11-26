<script setup lang="ts">
import { colorLevelSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";

const props = defineProps<{
	name: string;
	value: string;
}>();
</script>

<template>
	<SwatchCard :name="name">
		<div :class="['color-level-swatch__preview', colorLevelSwatch({ variant: value })]">
			{{ name }}
		</div>
	</SwatchCard>
</template>
