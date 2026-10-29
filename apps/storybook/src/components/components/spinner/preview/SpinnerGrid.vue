<script setup lang="ts">
import Spinner from "../Spinner.vue";
import SpinnerOverlay from "../SpinnerOverlay.vue";

const colors = ["primary", "light", "dark", "neutral"] as const;
</script>

<template>
	<div class="spinner-section">
		<div v-for="color in colors" :key="color">
			<div class="spinner-label">{{ color }}</div>
			<div class="spinner-row">
				<!-- dark is for dark surfaces, so it's shown on the overlay's backdrop. -->
				<div v-if="color === 'dark'" class="spinner-backdrop">
					<SpinnerOverlay>
						<Spinner :color="color" />
					</SpinnerOverlay>
				</div>
				<Spinner v-else :color="color" />
			</div>
		</div>
	</div>
</template>
