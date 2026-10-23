<script setup lang="ts">
// Replaces @uxfront/layer-docs's to start the header's menu with the Docs,
// Changelog and Log in links below 768px, where AppHeaderCTA has no room for
// them beside the header's buttons. Then the layer's Framework select, which
// its package doesn't export, and the docs' sections, from the same source as
// AppHeaderBottom's tabs: in their place, Docus's navigation would list Theme
// as one section.
const links = useHeaderLinks();
const { tabs } = useDocsSections();
const { frameworks } = useFramework();
const labelId = useId();
</script>

<template>
	<UNavigationMenu
		:items="links"
		orientation="vertical"
		class="mb-4 -mx-2.5 md:hidden"
	/>
	<div v-if="frameworks.length">
		<span
			:id="labelId"
			class="w-full pr-2.5 py-1.5 flex items-center text-sm text-muted"
		>
			Framework
		</span>
		<DocsFrameworkSelect :aria-labelledby="labelId" class="mb-2" />
	</div>
	<UNavigationMenu
		:items="tabs"
		orientation="vertical"
		aria-label="Sections"
		class="-mx-2.5"
	/>
</template>
