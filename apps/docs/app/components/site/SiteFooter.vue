<script setup lang="ts">
import {
	CHANGELOG_URL,
	CREDIT,
	DISCORD_URL,
	GITHUB_URL,
	INTRODUCTION_URL,
	LEGAL_LINKS,
	LOGIN_URL,
	PLAYGROUND_URL,
	STORYBOOK_URL,
	X_URL,
} from "~/data/site";

// The footer of the site's UXFront pages: main's credit, the links the docs
// header, footer and table of contents have, and the legal pages. The page
// puts it in a footer: UxFinale's `footer` slot, or a <footer> of its own.
const links = [
	{ label: "Docs", to: INTRODUCTION_URL },
	{ label: "Changelog", to: CHANGELOG_URL },
	{ label: "Storybook", to: STORYBOOK_URL },
	{ label: "Playground", to: PLAYGROUND_URL },
	{ label: "GitHub", to: GITHUB_URL },
	{ label: "X", to: X_URL },
	{ label: "Discord", to: DISCORD_URL },
	{ label: "Log in", to: LOGIN_URL },
];
</script>

<template>
	<div class="site-footer">
		<span>{{ CREDIT }}</span>
		<nav aria-label="Resources">
			<ul>
				<li v-for="link in links" :key="link.to">
					<NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
				</li>
			</ul>
		</nav>
		<nav aria-label="Legal">
			<ul>
				<li v-for="link in LEGAL_LINKS" :key="link.to">
					<NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style scoped>
.site-footer {
	display: flex;
	flex: 1;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem 2rem;
	font-family: var(--font-ux-mono);
	font-size: 0.75rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--ux-fg-3);
}

.site-footer ul {
	display: flex;
	flex-wrap: wrap;
	gap: 0 1.25rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.site-footer a {
	display: inline-flex;
	align-items: center;
	min-height: 2.75rem;
	color: var(--ux-fg-2);
	text-decoration: none;
	transition: color 0.3s var(--ux-ease-out);
}

.site-footer a:hover {
	color: var(--ux-fg);
}
</style>
