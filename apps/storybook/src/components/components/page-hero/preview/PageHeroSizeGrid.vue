<script setup lang="ts">
import PageHero from "../PageHero.vue";
import PageHeroActions from "../PageHeroActions.vue";
import PageHeroDescription from "../PageHeroDescription.vue";
import PageHeroHeadline from "../PageHeroHeadline.vue";
import PageHeroTitle from "../PageHeroTitle.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="page-hero-section">
		<div v-for="size in sizes" :key="size">
			<div class="page-hero-label">size: {{ size }}</div>
			<div class="page-hero-row">
				<PageHero color="neutral" :size="size" alignment="center">
					<PageHeroHeadline :size="size" alignment="center">
						<PageHeroTitle :size="size">{{ sizeTitles[size] }} hero</PageHeroTitle>
						<PageHeroDescription :size="size">
							Padding and typography scale with the size axis.
						</PageHeroDescription>
					</PageHeroHeadline>
					<PageHeroActions :size="size" alignment="center">
						<a class="page-hero-demo-cta">Get started</a>
					</PageHeroActions>
				</PageHero>
			</div>
		</div>
	</div>
</template>
