<script setup lang="ts">
import { corridor, ink, prism, stack, threshold } from "@uxfront/scene/formations";
import { FIGMA_PLUGIN_URL, FIGMA_URL, SITE_NAME } from "~/data/site";

const PLUGIN_DOCS_URL = "/docs/getting-started/integrations/figma-plugin";

useUxHead({
	title: "Figma Plugin - Design Tokens Sync - styleframe",
	description:
		"Styleframe is the source of truth for your design tokens. Sync variables between code and Figma using the W3C DTCG format, with full multi-mode support.",
	siteName: SITE_NAME,
	path: FIGMA_URL,
	image: {
		path: "/og/figma.png",
		width: 1200,
		height: 630,
		alt: "Export Styleframe Design Tokens to Figma and Back",
	},
});

// The copy sits on the left in every chapter, so the formations keep their
// default framing on the right. `key` tells repeated formations apart.
const scene = [
	ink({ label: "Figma Plugin" }),
	stack({ label: "Plugin" }),
	prism({ label: "Sync" }),
	threshold({ label: "Import" }),
	prism({ key: "export", label: "Export" }),
	stack({ key: "cli", label: "CLI" }),
	corridor({ label: "Install" }),
];

const nav = [
	{ href: "#plugin", label: "Plugin", index: "01" },
	{ href: "#sync", label: "Sync", index: "02" },
	{ href: "#import", label: "Import", index: "03" },
	{ href: "#export", label: "Export", index: "04" },
	{ href: "#cli", label: "CLI", index: "05" },
];

const sync = [
	{
		title: "Code-First Architecture",
		text: "Your Styleframe config is the single source of truth. Define tokens in TypeScript, export to Figma. When code changes, designers stay in sync.",
	},
	{
		title: "Type-Safe Tokens",
		text: "Full TypeScript support means autocomplete, refactoring, and compile-time errors. Catch token mismatches before they reach production.",
	},
	{
		title: "Multi-Mode by Design",
		text: "Light, dark, and custom themes are modeled using DTCG modifiers. Modes remain explicit, structured, and code-friendly.",
	},
	{
		title: "True Bidirectional Sync",
		text: "Import DTCG tokens into Figma or export Figma Variables back to JSON. Both directions preserve structure, aliases, and semantics.",
	},
	{
		title: "Automation-Ready",
		text: "Export tokens from code via CLI for CI/CD, reviews, and version control. Built for modern developer workflows.",
	},
	{
		title: "Free Forever",
		text: "No subscription. No seat limits. The CLI and Figma plugin are free and open source. Your design system, your rules.",
	},
];

const importing = [
	{
		title: "Drag & Drop",
		text: "Drop your tokens.json file into the plugin. Preview everything before committing to the import.",
	},
	{
		title: "Auto-Create Collections",
		text: "The plugin creates Figma collections with modes for Light, Dark, and any custom themes defined in your tokens.",
	},
	{
		title: "Type Validation",
		text: "Color, dimension, number, and string types are validated before import. Invalid tokens are flagged, not silently dropped.",
	},
];

const exporting = [
	{
		title: "One-Click Export",
		text: "Select a collection, click export. The plugin handles type conversion, alias mapping, and mode organization automatically.",
	},
	{
		title: "Clipboard Ready",
		text: "Copy the generated JSON directly to your clipboard. Paste into your codebase or save as a file for version control.",
	},
	{
		title: "Reference Syntax",
		text: "Variable aliases become DTCG references ({token.path}). Token relationships are preserved across every export.",
	},
];

const workflow = [
	{
		title: "Git-Integrated Workflow",
		text: "Export tokens on every commit. Track changes in version control alongside your code. Review token updates in pull requests.",
	},
	{
		title: "CI/CD Ready",
		text: "Add the export command to your build pipeline. Automatically sync tokens from your Styleframe config to Figma-compatible format.",
	},
];

const terminal = `# Export Styleframe variables to Figma-compatible format
npx styleframe figma export \\
        --config styleframe.config.ts \\
        --output tokens/ \\
        --collection "Design Tokens"

# Output:
# Loading configuration from "styleframe.config.ts"...
# Building DTCG document...
# Flattening to Figma-compatible format...
# Wrote "tokens/Default.tokens.json" (450 tokens)
# Wrote "tokens/Dark.tokens.json" (450 tokens)
# Exported 450 tokens as 2 Figma-compatible mode file(s)`;
</script>

<template>
	<UxSite :scene="scene" skip-to="#plugin" skip-label="Skip to the plugin">
		<template #header>
			<SiteHeader :nav="nav" nav-label="Figma Plugin" />
		</template>

		<UxHero
			kicker="Figma Plugin"
			title="Export Styleframe Design Tokens to Figma and Back"
			:index="nav"
			index-label="Figma Plugin"
			scroll-href="#plugin"
		>
			<template #lines>
				<UxHeroLine>Export Styleframe</UxHeroLine>
				<UxHeroLine>Design Tokens</UxHeroLine>
				<UxHeroLine><em class="ux-serif">to Figma</em> and Back</UxHeroLine>
			</template>
			<template #lead>
				Sync your design tokens between Figma and code. Import and export W3C
				DTCG format JSON with full multi-mode support for light and dark themes,
				completely free.
				<br />
				<span class="figma__actions">
					<UxPillLink :href="FIGMA_PLUGIN_URL" label="Install Figma plugin" />
					<UxPillLink
						:href="PLUGIN_DOCS_URL"
						label="Read plugin documentation"
					/>
				</span>
			</template>
		</UxHero>

		<UxChapter
			id="plugin"
			index="01"
			role="Plugin"
			title="The Figma plugin"
			:href="FIGMA_PLUGIN_URL"
			link-label="Install Figma plugin"
		>
			<SiteVideo
				src="/assets/video/styleframe-figma.mp4"
				poster="/assets/images/styleframe-figma-poster.jpg"
				:width="2204"
				:height="1080"
				label="The Styleframe Figma plugin syncing design tokens"
			/>
		</UxChapter>

		<UxChapter
			id="sync"
			index="02"
			role="Sync"
			title="A First-Class Token Synchronization Layer"
			:steps="sync.length"
		>
			<template #lead>
				Your code is your source of truth. Export it to the industry-standard
				Design Tokens Community Group format. Compatible with Figma, Style
				Dictionary, Tokens Studio, and other tools.
			</template>
			<SiteFeatures :items="sync" />
		</UxChapter>

		<UxChapter
			id="import"
			index="03"
			role="Import"
			title="Import Design Tokens into Figma"
			:steps="importing.length"
		>
			<template #lead>
				Drop a Styleframe DTCG JSON file into the plugin. Preview variables and
				modes before importing, then create a Figma variable collection with one
				click. All types mapped correctly.
			</template>
			<img
				class="figma__shot"
				src="/assets/images/figma-import.png"
				alt="Styleframe - Import Design Tokens into Figma"
				width="1176"
				height="1478"
				loading="lazy"
				decoding="async"
			/>
			<SiteFeatures :items="importing" />
		</UxChapter>

		<UxChapter
			id="export"
			index="04"
			role="Export"
			title="Export Figma Variables to Styleframe"
			:steps="exporting.length"
			href="https://www.designtokens.org/"
			link-label="Learn about DTCG Format"
		>
			<template #lead>
				Select a Figma variable collection and export it to the Styleframe W3C
				DTCG format. Copy the JSON or save it as a file. Aliases are preserved
				as proper token references.
			</template>
			<img
				class="figma__shot"
				src="/assets/images/figma-export.png"
				alt="Styleframe - Export Design Tokens from Figma"
				width="1118"
				height="1340"
				loading="lazy"
				decoding="async"
			/>
			<SiteFeatures :items="exporting" />
		</UxChapter>

		<UxChapter
			id="cli"
			index="05"
			role="Developer Workflow"
			title="Automate with the CLI"
			:steps="workflow.length"
			href="/docs/getting-started/tooling/cli#dtcg"
			link-label="CLI Documentation"
		>
			<template #lead>
				Export design tokens directly from your Styleframe config. Run in CI/CD
				pipelines to keep Figma tokens in sync with every code change. No manual
				exports, no drift.
			</template>
			<SiteCode title="Terminal" :code="terminal" />
			<SiteFeatures :items="workflow" />
		</UxChapter>

		<UxFinale kicker="Figma Plugin">
			<template #title>
				Sync Design Tokens to Figma in <em class="ux-serif">Minutes</em>
			</template>
			<template #lead>
				Install the Figma plugin, export your Styleframe config, and sync your
				design tokens. No subscriptions, no setup complexity.
			</template>
			<template #actions>
				<UxPillLink :href="FIGMA_PLUGIN_URL" label="Install Figma plugin" />
				<UxPillLink :href="PLUGIN_DOCS_URL" label="Read plugin documentation" />
			</template>
			<template #footer><SiteFooter /></template>
		</UxFinale>
	</UxSite>
</template>

<style scoped>
.figma__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-top: 2rem;
}

.figma__shot {
	display: block;
	width: min(100%, 22rem);
	height: auto;
	margin: 0 0 1.5rem;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
}
</style>
