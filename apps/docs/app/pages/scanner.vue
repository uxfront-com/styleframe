<script setup lang="ts">
import { corridor, empty, outline, tokens } from "@uxfront/scene/formations";
import { HERO_VIEWS } from "~/lib/formations";
import { INTRODUCTION_URL, SCANNER_URL, SITE_NAME } from "~/data/site";

const SCANNER_DOCS_URL = "/docs/getting-started/tooling/scanner";

useUxHead({
	title: "Utility Scanner - Automatic CSS Generation - styleframe",
	description:
		"Write utility classes directly in your markup. Styleframe's utility scanner detects them and generates only the CSS you use at build time — type-safe, framework-agnostic, with full HMR support.",
	siteName: SITE_NAME,
	path: SCANNER_URL,
	image: {
		path: "/og/scanner.png",
		width: 1200,
		height: 630,
		alt: "Utility-First Markup to CSS at Build Time",
	},
});

const scene = [
	tokens({ label: "Utility Scanner", views: HERO_VIEWS }),
	empty({ key: "scanner", label: "Write classes" }),
	outline({ key: "templates", label: "Templates", lines: true }),
	outline({ key: "output", label: "Output", lines: true }),
	corridor({ label: "Get started" }),
];

const nav = [
	{ href: "#scanner", label: "Scanner", index: "01" },
	{ href: "#templates", label: "Templates", index: "02" },
	{ href: "#output", label: "Output", index: "03" },
];

const features = [
	{
		title: "Zero Registration",
		text: "Use utility classes without pre-defining every value. The scanner registers them for you.",
	},
	{
		title: "Only Used CSS",
		text: "Your stylesheet holds exactly what your templates reference.",
	},
	{
		title: "Arbitrary Values",
		text: "Write a one-off value in brackets, like _padding:[2.5rem], without a token for it.",
	},
	{
		title: "Stacked Modifiers",
		text: "Chain modifiers freely, like _dark:hover:color:primary.",
	},
	{
		title: "Your Syntax, Your Rules",
		text: "You define the factories behind your classes: their names, allowed values and output.",
	},
	{
		title: "Instant HMR",
		text: "In development, only the files you change are rescanned.",
	},
];

const extraction = [
	{
		title: "12+ File Types",
		text: "Vue, React, Svelte, Astro, MDX, PHP, ERB, Twig, Blade and plain HTML, each with its own extractor.",
	},
	{
		title: "Custom Extractors",
		text: "For any other file type, write an extractor in a few lines and plug it in.",
	},
];

const template = `<template>
    <div class="_display:flex _gap:1rem _padding:lg">
        <button class="_background:primary
                       _hover:background:secondary
                       _padding:md
                       _font-weight:bold">
            Click me
        </button>
        <span class="_color:muted _font-size:sm">
            Detected and generated automatically.
        </span>
    </div>
</template>`;

const output = String.raw`/* Only the utilities your templates reference */

._padding\:lg {
        padding: var(--spacing-lg);
}

._background\:primary {
        background: var(--color-primary);
}

._hover\:background\:secondary:hover {
        background: var(--color-secondary);
}

/* Arbitrary values generate literal CSS */
._padding\:\[2\.5rem\] {
        padding: 2.5rem;
}`;
</script>

<template>
	<UxSite :scene="scene" skip-to="#scanner" skip-label="Skip to the scanner">
		<template #header>
			<SiteHeader :nav="nav" nav-label="Utility Scanner" />
		</template>

		<UxHero
			kicker="Utility Scanner"
			title="Utility-First Markup to CSS at Build Time"
			:index="nav"
			index-label="Utility Scanner"
			scroll-href="#scanner"
		>
			<template #lines>
				<UxHeroLine><em class="ux-serif">Utility-First</em></UxHeroLine>
				<UxHeroLine>Markup to CSS</UxHeroLine>
				<UxHeroLine>at Build Time</UxHeroLine>
			</template>
			<template #lead>
				If you've used Tailwind JIT, you already know the workflow. The
				difference: your classes are backed by type-safe factories and your own
				design tokens, and you control their syntax and naming.
				<br />
				<span class="scanner__actions">
					<UxPillLink :href="INTRODUCTION_URL" label="Get started" />
					<UxPillLink
						:href="SCANNER_DOCS_URL"
						label="Read utility scanner docs"
					/>
				</span>
			</template>
		</UxHero>

		<UxChapter
			id="scanner"
			index="01"
			role="Scanner"
			title="Write Classes. The Utility Scanner Handles the Rest"
			:steps="features.length"
		>
			<UxTraits :items="features" />
		</UxChapter>

		<UxSplit
			id="templates"
			index="02"
			role="Templates"
			title="Write Classes in Your Templates"
			:steps="extraction.length"
		>
			<template #lead>
				The scanner reads your source files, extracts every
				<code>_property:value</code> class, and generates the matching CSS at
				build time.
			</template>
			<UxTraits :items="extraction" />
			<template #aside>
				<UxCode title="Button.vue" :code="template" />
			</template>
		</UxSplit>

		<UxSplit
			id="output"
			index="03"
			role="Output"
			title="See Exactly What Gets Generated"
		>
			<template #lead>
				Design tokens resolve to CSS custom properties. Arbitrary bracket values
				produce literal CSS. Modifiers wrap declarations in the correct
				pseudo-selectors and media queries.
			</template>
			<template #aside>
				<UxCode title="Output CSS" :code="output" />
			</template>
		</UxSplit>

		<UxFinale kicker="Utility Scanner">
			<template #title>
				Start Writing Utility Classes <em class="ux-serif">Today</em>
			</template>
			<template #lead>
				Enable the scanner, register your factories, and let your templates
				drive your CSS output.
			</template>
			<template #actions>
				<UxPillLink :href="INTRODUCTION_URL" label="Get started" />
				<UxPillLink
					:href="SCANNER_DOCS_URL"
					label="Read utility scanner docs"
				/>
			</template>
			<template #footer><SiteFooter /></template>
		</UxFinale>
	</UxSite>
</template>

<style scoped>
.scanner__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 2rem;
}

code {
	font-family: var(--font-ux-mono);
	font-size: 0.875em;
}
</style>
