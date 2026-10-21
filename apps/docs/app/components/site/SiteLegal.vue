<script setup lang="ts">
import { uxRenderHookKey } from "@uxfront/ui";
import { SITE_NAME } from "~/data/site";

// A legal page: its Markdown from content/legal/, word for word, in the UXFront
// style, between the site's header and footer. No scene.
const { title } = defineProps<{
	/** The page's whole <title>, as on main. */
	title: string;
}>();

const route = useRoute();
const { data: page } = await useAsyncData(`legal-${route.path}`, () =>
	queryCollection("legal").path(route.path).first(),
);
if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

// Its Markdown copy, which llms.txt links. The crawler doesn't follow links to
// .md files, so prerender it with the page, as Docus does for docs pages.
prerenderRoutes(`/raw${route.path}.md`);

useUxHead({
	title,
	// Main's legal pages have an empty description.
	description: "",
	siteName: SITE_NAME,
	path: route.path,
	image: {
		path: `/og${route.path}.png`,
		width: 1200,
		height: 630,
		alt: page.value.title,
	},
});

// Like UxSite, the page carries every style it needs inline, so the layer can
// load the rest after first paint.
inject(uxRenderHookKey, null)?.();
</script>

<template>
	<div class="ux-site site-legal">
		<SiteHeader />
		<main class="site-legal__main">
			<article class="site-legal__article">
				<ContentRenderer v-if="page" :value="page" :prose="false" />
			</article>
		</main>
		<footer class="site-legal__footer">
			<SiteFooter />
		</footer>
	</div>
</template>

<style>
/* The UXFront tokens and page base, as UxSite brings them. */
@import "@uxfront/ui/css";
</style>

<style scoped>
.site-legal__main {
	padding: 8rem var(--ux-gutter) 4rem;
}

/* The docs' stylesheet loads after first paint and resets elements, so every
   element the Markdown renders is styled here. */
.site-legal__article {
	max-width: 46rem;
	margin: 0 auto;
	font-size: 1rem;
	line-height: 1.7;
	color: var(--ux-fg-2);
}

.site-legal__article :deep(h1) {
	margin: 0 0 1rem;
	font-size: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);
	font-weight: 500;
	line-height: 1;
	letter-spacing: -0.05em;
	text-wrap: balance;
	color: var(--ux-fg);
}

.site-legal__article :deep(h2) {
	margin: 3.5rem 0 1rem;
	padding-top: 1.5rem;
	font-size: 1.75rem;
	font-weight: 500;
	line-height: 1.2;
	letter-spacing: -0.03em;
	color: var(--ux-fg);
	border-top: 1px solid var(--ux-line);
}

.site-legal__article :deep(h3) {
	margin: 2.25rem 0 0.75rem;
	font-size: 1.25rem;
	font-weight: 500;
	line-height: 1.3;
	letter-spacing: -0.02em;
	color: var(--ux-fg);
}

.site-legal__article :deep(h4) {
	margin: 1.75rem 0 0.5rem;
	font-size: 1rem;
	font-weight: 500;
	line-height: 1.4;
	color: var(--ux-fg);
}

.site-legal__article :deep(:is(h1, h2, h3, h4)) {
	scroll-margin-top: 6rem;
}

.site-legal__article :deep(p) {
	margin: 0 0 1rem;
}

.site-legal__article :deep(:is(ul, ol)) {
	margin: 0 0 1rem;
	padding-left: 1.5rem;
}

.site-legal__article :deep(ul) {
	list-style: disc;
}

.site-legal__article :deep(ol) {
	list-style: decimal;
}

.site-legal__article :deep(li) {
	margin: 0.25rem 0;
}

.site-legal__article :deep(li > :is(ul, ol)) {
	margin: 0.25rem 0 0;
}

.site-legal__article :deep(strong) {
	font-weight: 500;
	color: var(--ux-fg);
}

.site-legal__article :deep(em) {
	font-style: italic;
}

.site-legal__article :deep(a) {
	color: var(--ux-fg);
	text-decoration: underline;
	text-decoration-color: var(--ux-line-strong);
	text-underline-offset: 0.2em;
	transition: text-decoration-color 0.3s var(--ux-ease-out);
}

.site-legal__article :deep(a:hover) {
	text-decoration-color: currentColor;
}

.site-legal__footer {
	display: flex;
	padding: 2rem var(--ux-gutter);
	border-top: 1px solid var(--ux-line);
}
</style>
