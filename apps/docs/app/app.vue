<script setup lang="ts">
// This app.vue replaces the Docus one, so docs pages and the changelog mount the
// Docus shell (header, sidebar, search) themselves. Other pages bring their own,
// and don't load it.
const DocusApp = defineAsyncComponent(() => import("docus/app/app.vue"));

const route = useRoute();
const usesDocus = computed(() =>
	["/docs", "/changelog"].some(
		(base) => route.path === base || route.path.startsWith(`${base}/`),
	),
);

useHead({
	titleTemplate: (title) => (title ? `${title} - styleframe` : "styleframe"),
});
</script>

<template>
	<NuxtRouteAnnouncer />
	<DocusApp v-if="usesDocus" />
	<NuxtPage v-else />
</template>

<style>
/* The UXFront pages (a `.ux-site`, the error page's too) frame their content
   at 1920px: past that width, the gutter grows by half the extra, so every
   section sits in a centred frame while the scene's canvas fills the screen.
   `--site-gutter` keeps the kit's own gutter, which SiteSplit places its
   aside by. */
:root:has(.ux-site) {
	--site-gutter: var(--ux-gutter);
}

.ux-site {
	--ux-gutter: max(
		var(--site-gutter),
		calc((100vw - 1920px) / 2 + var(--site-gutter))
	);
}
</style>
