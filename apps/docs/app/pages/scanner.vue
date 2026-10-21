<script setup lang="ts">
import { corridor, ink, prism, stack, threshold } from "@uxfront/scene/formations";
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
		alt: "Next Generation Utility-First Integration",
	},
});

const scene = [
	prism({ label: "Utility Scanner" }),
	stack({ label: "Write classes" }),
	ink({ label: "Templates" }),
	threshold({ label: "Output" }),
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
		text: "Use utility classes directly in your markup without pre-defining every value. The scanner detects and registers them for you.",
	},
	{
		title: "Only Used CSS",
		text: "Unused utilities produce no output. Your stylesheet contains exactly what your templates reference — nothing more, nothing less.",
	},
	{
		title: "Arbitrary Values",
		text: "Need a one-off value? Use bracket syntax like _padding:[2.5rem]. No need to register a design token for every edge case.",
	},
	{
		title: "Stacked Modifiers",
		text: "Chain modifiers freely. _dark:hover:color:primary just works — detected and generated automatically.",
	},
	{
		title: "Your Syntax, Your Rules",
		text: "Unlike fixed utility catalogs, you define the factories behind your classes. Control naming conventions, allowed values, and generation behavior — the scanner adapts to your system.",
	},
	{
		title: "Instant HMR",
		text: "Template changes trigger incremental rescans during development. Only changed files are re-processed — your feedback loop stays instant.",
	},
];

const extraction = [
	{
		title: "12+ File Types",
		text: "Vue, React, Svelte, Astro, MDX, PHP, ERB, Twig, Blade, and plain HTML — each with a specialized extractor optimized for its syntax.",
	},
	{
		title: "Custom Extractors",
		text: "Working with an unsupported file type? Write a custom extractor function in a few lines and plug it in.",
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
			title="Next Generation Utility-First Integration"
			:index="nav"
			index-label="Utility Scanner"
			scroll-href="#scanner"
		>
			<template #lines>
				<UxHeroLine>Next Generation</UxHeroLine>
				<UxHeroLine><em class="ux-serif">Utility-First</em></UxHeroLine>
				<UxHeroLine>Integration</UxHeroLine>
			</template>
			<template #lead>
				If you've used Tailwind JIT, you already know the workflow. Write
				utility classes in your markup, and the utility scanner generates only
				the CSS you use at build time. The difference: your classes are backed
				by type-safe factories and your own design tokens — with complete
				control over syntax, naming, and generation behavior.
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
			<template #lead>
				Use utility classes directly in your templates — no need to pre-define
				every value. The scanner reads your source files, detects your classes,
				and generates only the CSS you actually use.
			</template>
			<SiteFeatures :items="features" />
		</UxChapter>

		<UxChapter
			id="templates"
			index="02"
			role="Templates"
			title="Write Classes in Your Templates"
			:steps="extraction.length"
		>
			<template #lead>
				Use utility classes in your markup like you would with Tailwind. The
				scanner reads your source files, extracts every
				<code>_property:value</code> class, and generates the matching CSS at
				build time.
			</template>
			<SiteCode title="Button.vue" :code="template" />
			<SiteFeatures :items="extraction" />
		</UxChapter>

		<UxChapter
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
			<p class="scanner__note">
				What you write is what you get — predictable, readable output.
			</p>
			<SiteCode title="Output CSS" :code="output" />
		</UxChapter>

		<UxFinale kicker="Utility Scanner">
			<template #title>
				Start Writing Utility Classes <em class="ux-serif">Today</em>
			</template>
			<template #lead>
				Enable the scanner, register your factories, and let your templates
				drive your CSS output. Type-safe, JIT, and built on your own design
				tokens.
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

.scanner__note {
	margin: 0 0 1.5rem;
	color: var(--ux-fg-2);
}

code {
	font-family: var(--font-ux-mono);
	font-size: 0.875em;
}
</style>
