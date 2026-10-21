<script setup lang="ts">
import { corridor, prism, stack, threshold } from "@uxfront/scene/formations";
import { PRICING_URL, PRO_URL, SITE_NAME } from "~/data/site";

useUxHead({
	title: "styleframe Pro - Premium Design System Tools - styleframe",
	description:
		"Build beautiful design systems in minutes with styleframe Pro's premium composables, advanced features, and mathematical precision.",
	siteName: SITE_NAME,
	path: PRO_URL,
	image: {
		path: "/og/pro.png",
		width: 1200,
		height: 630,
		alt: "Build Faster with styleframe Pro",
	},
});

const scene = [
	stack({ label: "styleframe Pro" }),
	prism({ label: "Features" }),
	threshold({ label: "Pricing" }),
	corridor({ label: "Get Pro" }),
];

const nav = [
	{ href: "#features", label: "Features", index: "01" },
	{ href: "#pricing", label: "Pricing", index: "02" },
];

const features = [
	{
		title: "Premium Composables",
		text: "Advanced design system tools built on styleframe's type-safe API. Production-ready, fully tested.",
		to: "/docs/theme/design-tokens/fluid-design",
	},
	{
		title: "Unlimited Projects",
		text: "Use styleframe Pro on unlimited personal and commercial projects. Build websites, apps, and client work.",
	},
	{
		title: "Commercial License",
		text: "Includes commercial usage rights for client projects, SaaS applications, and commercial websites.",
	},
	{
		title: "Performance Optimized",
		text: "Smaller CSS bundles mean faster page loads. All of our composables are optimized for best performance.",
		to: "/docs/theme/design-tokens/fluid-design/viewport",
	},
	{
		title: "Complete Documentation",
		text: "In-depth guides, examples, and best practices. Get up and running in minutes with clear instructions.",
		to: "/docs/theme/design-tokens/fluid-design",
	},
];
</script>

<template>
	<UxSite :scene="scene" skip-to="#features" skip-label="Skip to the features">
		<template #header>
			<SiteHeader :nav="nav" nav-label="styleframe Pro" />
		</template>

		<UxHero
			kicker="styleframe Pro"
			title="Build Faster with styleframe Pro"
			:index="nav"
			index-label="styleframe Pro"
			scroll-href="#features"
		>
			<template #lines>
				<UxHeroLine>Build Faster</UxHeroLine>
				<UxHeroLine>with styleframe <em class="ux-serif">Pro</em></UxHeroLine>
			</template>
			<template #lead>
				Create beautiful design systems with mathematical precision. Premium
				composables and advanced features built on top of styleframe.
				<br />
				<UxPillLink class="pro__cta" :href="PRICING_URL" label="Get it now" />
			</template>
		</UxHero>

		<UxChapter
			id="features"
			index="01"
			role="Features"
			title="Premium Features for Professional Design Systems"
			:steps="features.length"
		>
			<SiteFeatures :items="features" />
		</UxChapter>

		<SiteSection
			id="pricing"
			index="02"
			role="Pricing"
			title="Simple, Transparent Pricing"
		>
			<template #lead>
				One-time purchase. Unlimited projects. Lifetime access. Free in
				development mode.
			</template>
			<SitePricing />
		</SiteSection>

		<UxFinale kicker="styleframe Pro">
			<template #title
				>Build faster with <em class="ux-serif">Pro</em>.</template
			>
			<template #actions>
				<UxPillLink :href="PRICING_URL" label="Get it now" />
			</template>
			<template #footer><SiteFooter /></template>
		</UxFinale>
	</UxSite>
</template>

<style scoped>
.pro__cta {
	margin-top: 2rem;
}
</style>
