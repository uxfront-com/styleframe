<script setup lang="ts">
import { corridor, empty, outline, tokens } from "@uxfront/scene/formations";
import { HERO_VIEWS } from "~/lib/formations";
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

// `key` tells the repeated formations apart.
const scene = [
	tokens({ label: "Figma Plugin", views: HERO_VIEWS }),
	outline({ key: "plugin", label: "Plugin" }),
	empty({ key: "sync", label: "Sync" }),
	outline({ key: "import", label: "Import" }),
	outline({ key: "export", label: "Export" }),
	outline({ key: "cli", label: "CLI", lines: true }),
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
		title: "Type-Safe Tokens",
		text: "Full TypeScript support, with autocomplete, refactoring and compile-time errors that catch token mismatches before production.",
	},
	{
		title: "Multi-Mode by Design",
		text: "Light, dark and custom themes are DTCG modifiers, so modes stay explicit.",
	},
	{
		title: "True Bidirectional Sync",
		text: "Import DTCG tokens into Figma or export Figma Variables back to JSON, with structure and aliases intact.",
	},
	{
		title: "Free Forever",
		text: "No subscription. No seat limits. The CLI and Figma plugin are free and open source. Your design system, your rules.",
	},
];

const importing = [
	{
		title: "Auto-Create Collections",
		text: "Each collection gets a mode for Light, Dark and every custom theme in your tokens.",
	},
	{
		title: "Type Validation",
		text: "Color, dimension, number and string types are checked before import, and invalid tokens are flagged, not dropped.",
	},
];

const exporting = [
	{
		title: "One-Click Export",
		text: "The plugin converts types, maps aliases and organizes modes for you.",
	},
	{
		title: "Clipboard Ready",
		text: "Copy the JSON to your clipboard, or save it as a file for version control.",
	},
	{
		title: "Reference Syntax",
		text: "Variable aliases become DTCG references ({token.path}).",
	},
];

const workflow = [
	{
		title: "Git-Integrated Workflow",
		text: "Export tokens on every commit, and review token updates in pull requests.",
	},
	{
		title: "CI/CD Ready",
		text: "Add the export command to your build pipeline.",
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
				Sync your design tokens between Figma and code as W3C DTCG JSON, with a
				mode for each theme, completely free.
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

		<UxSplit
			id="plugin"
			index="01"
			role="Plugin"
			title="The Figma plugin"
			:href="FIGMA_PLUGIN_URL"
			link-label="Install Figma plugin"
		>
			<template #aside>
				<UxVideo
					data-outline
					src="/assets/video/styleframe-figma.mp4"
					poster="/assets/images/styleframe-figma-poster.jpg"
					:width="2204"
					:height="1080"
					label="The Styleframe Figma plugin syncing design tokens"
				/>
			</template>
		</UxSplit>

		<UxChapter
			id="sync"
			index="02"
			role="Sync"
			title="A First-Class Token Synchronization Layer"
			:steps="sync.length"
		>
			<template #lead>
				Your code is your source of truth. Export it to the Design Tokens
				Community Group format, which Figma, Style Dictionary, Tokens Studio and
				other tools read.
			</template>
			<UxTraits :items="sync" />
		</UxChapter>

		<UxSplit
			id="import"
			index="03"
			role="Import"
			title="Import Design Tokens into Figma"
			:steps="importing.length"
		>
			<template #lead>
				Drop a Styleframe DTCG JSON file into the plugin, preview its variables
				and modes, and create a Figma variable collection with one click.
			</template>
			<UxTraits :items="importing" />
			<template #aside>
				<img
					class="figma__shot"
					data-outline
					src="/assets/images/figma-import.png"
					alt="Styleframe - Import Design Tokens into Figma"
					width="1118"
					height="1340"
					loading="lazy"
					decoding="async"
				/>
			</template>
		</UxSplit>

		<UxSplit
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
				DTCG format.
			</template>
			<UxTraits :items="exporting" />
			<template #aside>
				<img
					class="figma__shot"
					data-outline
					src="/assets/images/figma-export.png"
					alt="Styleframe - Export Design Tokens from Figma"
					width="1176"
					height="1478"
					loading="lazy"
					decoding="async"
				/>
			</template>
		</UxSplit>

		<UxSplit
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
				pipelines to keep Figma tokens in sync with every code change.
			</template>
			<UxTraits :items="workflow" />
			<template #aside>
				<UxCode title="Terminal" :code="terminal" />
			</template>
		</UxSplit>

		<UxFinale kicker="Figma Plugin">
			<template #title>
				Sync Design Tokens to Figma in <em class="ux-serif">Minutes</em>
			</template>
			<template #lead>
				Install the Figma plugin, export your Styleframe config, and sync your
				design tokens. No subscriptions.
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

/* Portrait screenshots fit the screen's height beside the copy. A definite
   width lets the image's attributes reserve its box before it loads. */
.figma__shot {
	display: block;
	width: min(100%, 56svh);
	height: auto;
	margin-left: auto;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
}
</style>
