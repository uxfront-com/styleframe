<script setup lang="ts">
/**
 * Renders Nuxt UI's ProseCodeGroup, and renders it again once the page has
 * loaded, so each tab names a panel that's on the page. Its tabs and panels
 * take their ids from useId(), which Nuxt's useAsyncData makes differ between
 * the prerendered page and the browser, and the browser sets the tabs'
 * `aria-controls` only after it loads. So a tab pointed at the browser's panel
 * id while the panel kept the prerendered one. Rendered in the browser, both
 * take the same id, and the markup doesn't change. It's global, as Nuxt UI's
 * prose components are, so Markdown finds it.
 */
import { useMounted } from "@vueuse/core";
import NuxtProseCodeGroup from "#ui/components/prose/CodeGroup.vue";

const mounted = useMounted();
</script>

<template>
	<NuxtProseCodeGroup :key="mounted ? 'browser' : 'prerendered'">
		<slot />
	</NuxtProseCodeGroup>
</template>
