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
/* The kit's UxTraits has no option for the arrow after a linked card's heading,
   so this removes it. Three classes outrank the kit's scoped rule, whatever order
   the stylesheets load in. */
.ux-traits .ux-traits__linked .ux-traits__link strong::after {
	content: none;
}
</style>
