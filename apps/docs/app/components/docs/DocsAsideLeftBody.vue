<script setup lang="ts">
import { useMounted } from "@vueuse/core";

// Replaces Docus's to show the pages of the section the reader is in, grouped
// by their category folders (useDocsSections). The rest is Docus's.
const { sidebarNavigation } = useDocsSections();

const contentNavVariants = useUIConfig("contentNavigation");

// The navigation renders again once the page has loaded. Its category groups
// are accordions whose triggers name their lists by ids from useId(), which
// Nuxt's useAsyncData makes differ between the prerendered page and the
// browser, so a trigger named a list id that wasn't on the page. Rendered in
// the browser, the trigger and its list take the same id. The markup is the
// same, so nothing on the screen changes.
const mounted = useMounted();
</script>

<template>
	<UContentNavigation
		:key="mounted ? 'browser' : 'prerendered'"
		:collapsible="false"
		:highlight="contentNavVariants.highlight ?? true"
		:highlight-color="contentNavVariants.highlightColor"
		:variant="contentNavVariants.variant ?? 'link'"
		:color="contentNavVariants.color"
		:navigation="sidebarNavigation"
	/>
</template>
