<script setup lang="ts">
import { corridor, outline, tokens } from "@uxfront/scene/formations";
import { device, HERO_VIEWS } from "~/lib/formations";
import {
	FIGMA_URL,
	GITHUB_URL,
	INTRODUCTION_URL,
	SCANNER_URL,
	SITE_NAME,
	X_URL,
} from "~/data/site";

const THEMES_URL = "/docs/api/themes";
const RECIPES_URL = "/docs/api/recipes";
const CONFIGURATION_URL = "/docs/api/instance#configuration-options";
const FLUID_DESIGN_URL = "/docs/theme/design-tokens/fluid-design";

useUxHead({
	title: "The Design Systems Styling Engine - styleframe",
	description:
		"Styleframe turns your design system into a type-safe TypeScript source of truth and compiles it to CSS — one engine behind tokens, themes, utilities, and recipes.",
	siteName: SITE_NAME,
	image: {
		path: "/og/index.png",
		width: 1200,
		height: 630,
		alt: "Type-safe Styling Engine for Design Systems",
	},
	sameAs: [GITHUB_URL, X_URL],
});

// One formation per section, in order: the hero, a chapter per section of
// main's homepage, the finale. The hero's tokens re-theme on click.
const theme = tokens({ label: "Styleframe", views: HERO_VIEWS });
const scene = [
	theme,
	outline({ key: "config", label: "One config", lines: true }),
	outline({ key: "compose", label: "Compose", lines: true }),
	outline({ key: "themes", label: "Themes", lines: true }),
	outline({ key: "output", label: "Zero-runtime", lines: true }),
	outline({ key: "scanner", label: "Scanner", lines: true }),
	outline({ key: "figma", label: "Figma" }),
	outline({ key: "ai", label: "AI" }),
	device({ label: "Fluid design" }),
	corridor({ label: "Get started" }),
];

// The hero's index: four of the eight chapters.
const nav = [
	{ href: "#config", label: "Config", index: "01" },
	{ href: "#themes", label: "Themes", index: "03" },
	{ href: "#scanner", label: "Scanner", index: "05" },
	{ href: "#ai", label: "AI", index: "07" },
];

const config = [
	{
		title: "The compiler is your design-system reviewer",
		text: "Autocomplete runs from a token to a recipe variant. Rename a token and the build fails at the reference, not in production.",
		to: "/docs/api",
	},
	{
		title: "Composable",
		text: "Compose and reuse styles with functions, variables, arrays or objects.",
		to: "/docs/api/composables",
	},
	{
		title: "Built-in Theming",
		text: "Light, dark and custom themes, all from the same tokens.",
		to: THEMES_URL,
	},
	{
		title: "One plugin, every major bundler",
		text: "The same config drives Vite, Nuxt, Webpack, Rollup, esbuild, Rspack, Farm, Astro and Bun. Framework-agnostic output works with React, Vue, Svelte, Solid, Astro and more.",
		to: "/docs/getting-started/installation",
	},
	{
		title: "Fully Configurable",
		text: "Every option is typed and in one place.",
		to: CONFIGURATION_URL,
	},
	{
		title: "Intuitive Developer Experience",
		text: "Autocomplete, in-editor docs and static analysis for your CSS.",
		to: "/docs/getting-started/guides",
	},
];

const compose = [
	{
		title: "Infinitely Customizable",
		text: "Make it your own. Start from the default theme and customize every token.",
	},
	{
		title: "Mix and Match Composables",
		text: "Colors from one theme, typography from another.",
	},
];

const themes = [
	{
		title: "Intuitive API",
		text: "A theme is as easy to write as a variable, with no special syntax or class names to remember.",
		to: THEMES_URL,
	},
	{
		title: "Mix and Match Themes",
		text: "Take colors from one theme and typography from another.",
		to: THEMES_URL,
	},
];

const output = [
	{
		title: "Static Generation",
		text: "Your base styles cost nothing at runtime.",
	},
	{
		title: "Dual Output",
		text: "The transpiler outputs both CSS and TypeScript, and you control exactly what each token generates.",
		to: CONFIGURATION_URL,
	},
	{
		title: "Optional Runtime",
		text: "Recipes turn props into dynamic component variants, built on the static CSS.",
		to: RECIPES_URL,
	},
];

const scanner = [
	{
		title: "Automatic Detection",
		text: "No need to pre-define every value: the scanner matches each class to your factories and resolves your tokens.",
	},
	{
		title: "Framework Agnostic",
		text: "Built-in extractors for HTML, Vue, React, Svelte, Astro, MDX and more, or add your own.",
	},
];

const figma = [
	{
		title: "Bidirectional Sync",
		text: "Import tokens into Figma, or export Figma Variables back to JSON, with structure and aliases intact.",
	},
	{
		title: "Multi-Mode Support",
		text: "Light, dark and custom themes become Figma modes, on every sync.",
	},
];

const ai = [
	{
		title: "Styleframe MCP",
		text: "Connect styleframe to Cursor, Claude, ChatGPT and more.",
	},
	{
		title: "Useful AI, built in",
		text: "AI workflows that build your design system for you.",
	},
];

const fluid = [
	{
		code: "01",
		title: "Step 1",
		text: "Set the scale for phones",
	},
	{
		code: "02",
		title: "Step 2",
		text: "Set the scale for desktops",
	},
	{
		code: "03",
		title: "Step 3",
		text: "Watch as everything scales fluidly in between",
	},
];
</script>

<template>
	<UxSite :scene="scene" skip-to="#config" skip-label="Skip to the features">
		<template #controls>
			<UxAnchor
				anchor="tokens:theme"
				variant="button"
				aria-label="Switch theme"
				@click="theme.next()"
			>
				theme
				<b data-theme-name>{{ theme.themes[0] }}</b>
			</UxAnchor>
		</template>
		<template #header>
			<SiteHeader />
		</template>

		<UxHero
			title="Type-safe Styling Engine for Design Systems"
			:index="nav"
			index-label="Features"
			scroll-href="#config"
		>
			<template #lines>
				<UxHeroLine>Type-safe</UxHeroLine>
				<UxHeroLine>Styling Engine for</UxHeroLine>
				<UxHeroLine><em class="ux-serif">Design Systems</em></UxHeroLine>
			</template>
			<template #lead>
				Write tokens, themes, utilities and recipes in TypeScript, and compile
				them to zero-runtime CSS and types. Catch a renamed token before your
				users do.
				<br />
				<span class="home__actions">
					<UxPillLink :href="INTRODUCTION_URL" label="Get started" />
					<UxPillLink :href="GITHUB_URL" label="Star on GitHub" />
				</span>
			</template>
		</UxHero>

		<SiteSplit
			id="config"
			index="01"
			role="One config"
			title="Your whole design system, from one config"
			:steps="config.length"
		>
			<template #lead>
				Change a token once, and it flows to every selector, theme and recipe
				that uses it.
			</template>
			<SiteFeatures :items="config" />
			<template #aside><SiteSample name="config" /></template>
		</SiteSplit>

		<SiteSplit
			id="compose"
			index="02"
			role="Compose"
			title="Compose your system from existing parts"
			href="/docs/theme/design-tokens"
			link-label="Explore the default theme"
			:steps="compose.length"
		>
			<template #lead>
				Build your design system from composables you already have, all
				resolving through one source.
			</template>
			<UxTraits :items="compose" />
			<template #aside><SiteSample name="compose" /></template>
		</SiteSplit>

		<SiteSplit
			id="themes"
			index="03"
			role="Themes"
			title="One source, every theme"
			:href="THEMES_URL"
			link-label="Learn about themes"
			:steps="themes.length"
		>
			<template #lead>
				Light, dark and custom themes come from the same tokens, with no
				separate stylesheet to keep in sync.
			</template>
			<SiteFeatures :items="themes" />
			<template #aside><SiteSample name="themes" /></template>
		</SiteSplit>

		<SiteSplit
			id="output"
			index="04"
			role="Output"
			title="Zero-Runtime by Default, Dynamic When You Need It"
			:href="RECIPES_URL"
			link-label="Learn more about Recipes"
			:steps="output.length"
		>
			<template #lead>
				Your system compiles to static CSS at build time. When you need
				prop-based styling, an optional runtime handles Recipes.
			</template>
			<SiteFeatures :items="output" />
			<template #aside><SiteSample name="output" /></template>
		</SiteSplit>

		<SiteSplit
			id="scanner"
			index="05"
			role="Scanner"
			title="Write Markup, Skip the CSS"
			:href="SCANNER_URL"
			link-label="Learn more about the Scanner"
			:steps="scanner.length"
		>
			<template #lead>
				Our Utility Scanner is like Tailwind JIT, but type-safe and built on
				your own design system. Write utility classes in your markup, and it
				generates only the CSS you use.
			</template>
			<UxTraits :items="scanner" />
			<template #aside><SiteSample name="scanner" /></template>
		</SiteSplit>

		<SiteSplit
			id="figma"
			index="06"
			role="Figma"
			title="Sync Design Tokens with Figma"
			:href="FIGMA_URL"
			link-label="Learn more about the Figma Plugin"
			:steps="figma.length"
		>
			<template #lead>
				Export your Styleframe design tokens to the W3C DTCG format and import
				them into Figma, with a mode for each theme.
			</template>
			<UxTraits :items="figma" />
			<template #aside>
				<img
					class="home__shot"
					data-outline
					src="/assets/images/figma-import.png"
					alt="Styleframe - Import Design Tokens into Figma"
					width="1118"
					height="1340"
					loading="lazy"
					decoding="async"
				/>
			</template>
		</SiteSplit>

		<SiteSplit
			id="ai"
			index="07"
			role="Coming Soon"
			title="AI that Writes Type-safe Composable CSS"
			:steps="ai.length"
		>
			<template #lead>
				Delegate work to AI agents, from code generation to other technical
				tasks.
			</template>
			<UxTraits :items="ai" />
			<SiteWaitlist group="ai" label="Join waitlist for styleframe AI" />
			<template #aside>
				<SiteVideo
					class="home__video"
					data-outline
					src="/assets/video/styleframe-ai.mp4"
					poster="/assets/images/styleframe-ai.webp"
					:width="2048"
					:height="2048"
					label="styleframe AI writing type-safe composable CSS"
				/>
			</template>
		</SiteSplit>

		<SiteSplit
			id="fluid"
			index="08"
			role="Fluid design"
			title="Typography that flows naturally across every screen size"
			:href="FLUID_DESIGN_URL"
			link-label="Fluid Responsive Design"
			:steps="fluid.length"
			align="center"
		>
			<template #lead>
				Skip the breakpoints. Styleframe scales your typography and spacing
				fluidly from phone to desktop.
			</template>
			<UxPillars :items="fluid" />
		</SiteSplit>

		<UxFinale kicker="styleframe">
			<template #title>
				The Design Systems <em class="ux-serif">Styling Engine</em>
			</template>
			<template #actions>
				<UxPillLink :href="INTRODUCTION_URL" label="Get started" />
				<UxPillLink :href="GITHUB_URL" label="Star on GitHub" />
			</template>
			<template #footer><SiteFooter /></template>
		</UxFinale>
	</UxSite>
</template>

<style scoped>
.home__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 2rem;
}

/* Portrait and square media fit the screen's height beside the copy. A
   definite width lets the image's attributes reserve its box before it loads. */
.home__shot {
	display: block;
	width: min(100%, 56svh);
	height: auto;
	margin-left: auto;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
}

/* Doubled, to outrank SiteVideo's own width. */
.home__video.site-video {
	width: min(100%, 70svh);
	margin-left: auto;
}
</style>
