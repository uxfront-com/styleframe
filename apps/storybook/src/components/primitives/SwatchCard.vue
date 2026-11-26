<script setup lang="ts">
defineProps<{
	name: string;
	label?: string;
	previewClass?: string;
	orientation?: "horizontal" | "vertical";
}>();
</script>

<template>
	<div :class="['swatch-card', orientation ? `swatch-card--${orientation}` : '']">
		<div class="swatch-card__body">
			<slot>
				<div :class="['swatch-card__preview', previewClass]" />
			</slot>
		</div>
		<div class="swatch-card__footer">
			<slot name="label">
				<span v-if="label" class="swatch-card__label">{{ label }}</span>
			</slot>
		</div>
	</div>
</template>
