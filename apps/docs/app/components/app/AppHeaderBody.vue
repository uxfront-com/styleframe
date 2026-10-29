<script setup lang="ts">
// Replaces @uxfront/layer-docs's to start the header's menu with the Docs,
// Changelog and Log in links below 768px, where AppHeaderCTA has no room for
// them beside the header's buttons. Then the layer's Framework select, which
// its package doesn't export, and the docs' sections, from the same source as
// AppHeaderBottom's tabs: in their place, Docus's navigation would list Theme
// as one section. Each section links to its first page, and its toggle opens
// the pages its sidebar lists, rendered as DocsAsideLeftBody renders them.
// The reader's section starts open. The collapsible's root is display:
// contents, so its toggle sits beside the section's link and its pages below
// both.
const links = useHeaderLinks();
const { sidebars } = useDocsSections();
const { frameworks } = useFramework();
const labelId = useId();

const appConfig = useAppConfig();
const contentNavVariants = useUIConfig("contentNavigation");
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
	<nav aria-label="Sections" class="-mx-2.5">
		<div
			v-for="section in sidebars"
			:key="section.label"
			class="grid grid-cols-[1fr_auto] items-center"
		>
			<UButton
				:to="section.to"
				:label="section.label"
				:icon="section.icon"
				color="neutral"
				variant="ghost"
				:active="section.active"
				active-color="primary"
			/>
			<UCollapsible
				:default-open="section.active"
				class="contents"
				:ui="{ content: 'col-span-2 px-2.5 py-2' }"
			>
				<UButton
					:icon="appConfig.ui.icons.chevronDown"
					color="neutral"
					variant="ghost"
					:aria-label="`${section.label} pages`"
					class="group"
					:ui="{
						leadingIcon:
							'transition-transform group-data-[state=open]:rotate-180',
					}"
				/>

				<template #content>
					<UContentNavigation
						:collapsible="false"
						:highlight="contentNavVariants.highlight ?? true"
						:highlight-color="contentNavVariants.highlightColor"
						:variant="contentNavVariants.variant ?? 'link'"
						:color="contentNavVariants.color"
						:navigation="section.navigation"
						:aria-label="section.label"
					/>
				</template>
			</UCollapsible>
		</div>
	</nav>
</template>
