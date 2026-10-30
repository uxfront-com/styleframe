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
