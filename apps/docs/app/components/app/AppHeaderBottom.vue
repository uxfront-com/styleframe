<script setup lang="ts">
// Replaces Docus's to show the docs' sections as tabs, with Theme split into its
// four sub-sections (useDocsSections). The rest is Docus's.
const { tabs } = useDocsSections();

const navMenuVariants = useUIConfig("navigationMenu");
</script>

<template>
	<USeparator class="hidden lg:flex" />

	<UContainer class="hidden lg:flex items-center justify-between">
		<UNavigationMenu
			:items="tabs"
			:highlight="navMenuVariants.highlight ?? true"
			:highlight-color="navMenuVariants.highlightColor"
			:variant="navMenuVariants.variant ?? 'pill'"
			:color="navMenuVariants.color"
			class="-mx-2.5 -mb-px"
		/>

		<AppHeaderBottomRight />
	</UContainer>
</template>
