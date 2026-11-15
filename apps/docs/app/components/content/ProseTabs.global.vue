<script setup lang="ts">
/**
 * Renders Nuxt UI's ProseTabs, and renders it again once the page has loaded,
 * so each tab names a panel that's on the page, as ProseCodeGroup.global.vue
 * explains.
 */
import { useMounted } from "@vueuse/core";
import NuxtProseTabs from "#ui/components/prose/Tabs.vue";

const mounted = useMounted();
</script>

<template>
	<NuxtProseTabs :key="mounted ? 'browser' : 'prerendered'">
		<slot />
	</NuxtProseTabs>
</template>
