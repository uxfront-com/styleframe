<script setup lang="ts">
import PageHero from "../PageHero.vue";
import PageHeroActions from "../PageHeroActions.vue";
import PageHeroBody from "../PageHeroBody.vue";
import PageHeroDescription from "../PageHeroDescription.vue";
import PageHeroHeadline from "../PageHeroHeadline.vue";
import PageHeroImage from "../PageHeroImage.vue";
import PageHeroTitle from "../PageHeroTitle.vue";

const colors = ["neutral", "light", "dark"] as const;
const orientations = ["vertical", "horizontal"] as const;
</script>

<template>
	<div class="page-hero-section">
		<div v-for="orientation in orientations" :key="orientation">
			<div class="page-hero-label">orientation: {{ orientation }}</div>
			<div class="page-hero-row">
				<PageHero
					v-for="color in colors"
					:key="`${orientation}-${color}`"
					:color="color"
					:orientation="orientation"
					alignment="center"
				>
					<PageHeroBody alignment="center" :orientation="orientation">
						<PageHeroHeadline alignment="center" :orientation="orientation">
							<PageHeroTitle>{{ orientation }} · {{ color }}</PageHeroTitle>
							<PageHeroDescription>
								A landing-section primitive with composable sub-recipes.
							</PageHeroDescription>
						</PageHeroHeadline>
						<PageHeroActions alignment="center" :orientation="orientation">
							<a class="page-hero-demo-cta">Primary</a>
							<a class="page-hero-demo-cta page-hero-demo-cta-secondary"> Secondary </a>
						</PageHeroActions>
					</PageHeroBody>
					<PageHeroImage>
						<div class="page-hero-demo-media">Media slot</div>
					</PageHeroImage>
				</PageHero>
			</div>
		</div>
	</div>
</template>
