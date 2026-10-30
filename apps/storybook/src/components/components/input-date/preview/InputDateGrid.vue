<script setup lang="ts">
import InputDate from "../InputDate.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["default", "soft", "ghost"] as const;
</script>

<template>
	<div class="input-date-section">
		<div v-for="variant in variants" :key="variant">
			<div class="input-date-label">{{ variant }}</div>
			<div class="input-date-row">
				<!-- light is for light surfaces and dark for dark ones, in both themes. -->
				<span
					v-for="color in colors"
					:key="`${variant}-${color}`"
					:class="{
						'input-date-surface-light': color === 'light',
						'input-date-surface-dark': color === 'dark',
					}"
				>
					<InputDate :color="color" :variant="variant" />
				</span>
			</div>
		</div>
	</div>
</template>
