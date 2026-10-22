<script setup lang="ts">
import type { FunctionalComponent } from "vue";

// A code sample from content/home/, highlighted when the site is built, in a
// window frame named after its file.
const { name } = defineProps<{
	/** The sample's file name in content/home/, without `.md`. */
	name: string;
}>();

const { data: sample } = await useAsyncData(`home-${name}`, () =>
	queryCollection("home").where("stem", "=", `home/${name}`).first(),
);

// The highlighted <pre> with its classes only: without the prose components,
// it would also carry its whole source as a `code` attribute.
const Pre: FunctionalComponent<{ class?: string }> = (props, { slots }) =>
	h("pre", { class: props.class }, slots.default?.());
Pre.inheritAttrs = false;
</script>

<template>
	<figure v-if="sample" class="site-sample" data-code-panel>
		<figcaption class="ux-mono">{{ sample.title }}</figcaption>
		<ContentRenderer
			:value="sample"
			:prose="false"
			:components="{ pre: Pre }"
		/>
	</figure>
</template>

<style scoped>
.site-sample {
	margin: 0;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
	background: rgb(5 5 7 / 0.85);
	backdrop-filter: blur(10px);
	overflow: hidden;
	text-shadow: none;
}

.site-sample figcaption {
	padding: 0.6rem 1rem;
	font-size: 0.75rem;
	color: var(--ux-fg-3);
}

.site-sample :deep(pre) {
	max-height: 70svh;
	margin: 0;
	padding: 1rem;
	overflow: auto;
	font-family: var(--font-ux-mono);
	font-size: 0.8125rem;
	line-height: 1.6;
	color: var(--ux-fg-2);
	border-top: 1px solid var(--ux-line);
}

.site-sample :deep(pre + pre) {
	border-top-style: dashed;
}

.site-sample :deep(.line) {
	display: block;
}

/* The page is always dark: take the dark theme's colours, whatever colour
   mode the docs left on <html>. Each sample's own styles set the colours with
   `html.light .shiki span` and `html.dark .shiki span`, so this outranks them.
   A touch of the foreground lifts the theme's comments (#676e95) to 4.5:1. */
html .site-sample :deep(pre span) {
	color: color-mix(in srgb, var(--shiki-dark), var(--ux-fg) 12%);
	background: none;
	font-style: var(--shiki-dark-font-style);
	font-weight: var(--shiki-dark-font-weight);
	text-decoration: var(--shiki-dark-text-decoration);
}
</style>
