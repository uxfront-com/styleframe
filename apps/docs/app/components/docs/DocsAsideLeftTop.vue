<script setup lang="ts">
// Replaces @uxfront/layer-docs's to give the Framework label a fixed id, where
// the layer's takes one from useId(). Nuxt's useAsyncData counts toward
// useId() on the server only, so the browser's id differed from the
// prerendered label's and the select lost its name. Only the sidebar renders
// this label. The rest is the layer's: the framework select above the sidebar
// navigation, and Docus's own below it.
import DocusAsideLeftTop from "docus/app/components/docs/DocsAsideLeftTop.vue";

const { frameworks } = useFramework();
</script>

<template>
	<div v-if="frameworks.length">
		<span
			id="docs-aside-framework-label"
			class="w-full pr-2.5 py-1.5 flex items-center text-sm text-muted"
		>
			Framework
		</span>
		<DocsFrameworkSelect
			aria-labelledby="docs-aside-framework-label"
			class="mb-2"
		/>
	</div>
	<DocusAsideLeftTop />
</template>
