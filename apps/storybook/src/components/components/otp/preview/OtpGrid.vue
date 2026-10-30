<script setup lang="ts">
import Otp from "../Otp.vue";

const variants = ["default", "soft", "ghost"] as const;
const colors = ["neutral", "light", "dark"] as const;
</script>

<template>
	<div class="otp-section">
		<div v-for="variant in variants" :key="variant">
			<div class="otp-label">{{ variant }}</div>
			<div class="otp-row">
				<div v-for="color in colors" :key="`${variant}-${color}`">
					<div class="otp-caption">{{ color }}</div>
					<!-- light is for light surfaces and dark for dark ones, in both themes. -->
					<span
						:class="{
							'otp-surface-light': color === 'light',
							'otp-surface-dark': color === 'dark',
						}"
					>
						<Otp :color="color" :variant="variant" :length="4" value="12" />
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
