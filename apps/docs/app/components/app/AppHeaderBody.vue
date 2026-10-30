<script setup lang="ts">
// Replaces @uxfront/layer-docs's to keep its header links (below 768px, where
// the layer's AppHeaderCTA hides them) and Framework select, then list the
// docs' sections, from the same source as AppHeaderBottom's tabs: in their
// place, Docus's navigation would list Theme as one section. Each section
// links to its first page, and its toggle opens the pages its sidebar lists,
// rendered as DocsAsideLeftBody renders them. The reader's section starts
// open. The collapsible's root is display: contents, so its toggle sits beside
// the section's link and its pages below both.
const { sidebars } = useDocsSections();

const appConfig = useAppConfig();
const contentNavVariants = useUIConfig("contentNavigation");
</script>

<template>
	<AppHeaderLinks orientation="vertical" class="mb-4 -mx-2.5 md:hidden" />
	<AppHeaderFramework />
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
