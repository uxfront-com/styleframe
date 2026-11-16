<script setup lang="ts">
// Replaces Docus's to show the pages of the section the reader is in, grouped
// by their category folders (useDocsSections). The rest is Docus's.
const { sidebarNavigation } = useDocsSections();

const contentNavVariants = useUIConfig("contentNavigation");
</script>

<template>
	<UContentNavigation
		:collapsible="false"
		:highlight="contentNavVariants.highlight ?? true"
		:highlight-color="contentNavVariants.highlightColor"
		:variant="contentNavVariants.variant ?? 'link'"
		:color="contentNavVariants.color"
		:navigation="sidebarNavigation"
	/>
</template>
