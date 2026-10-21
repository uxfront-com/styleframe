<script setup lang="ts">
import type { FunctionalComponent } from "vue";

// A code sample from content/home/, highlighted when the site is built,
// behind a disclosure named after its file.
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
	<details v-if="sample" class="site-sample">
		<summary>
			<span>View code</span>
			<span class="ux-mono">{{ sample.title }}</span>
		</summary>
		<ContentRenderer
			:value="sample"
			:prose="false"
			:components="{ pre: Pre }"
		/>
	</details>
</template>

<style scoped>
.site-sample {
	margin: 1.5rem 0 0;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
	background: rgb(5 5 7 / 0.85);
	backdrop-filter: blur(10px);
	overflow: hidden;
	text-shadow: none;
}

.site-sample summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	min-height: 2.75rem;
	padding: 0 1rem;
	font-size: 0.875rem;
	color: var(--ux-fg);
	cursor: pointer;
}

.site-sample summary::marker {
	content: "";
}

.site-sample summary span:first-child::before {
	content: "+ ";
	color: var(--ux-fg-3);
}

.site-sample[open] summary span:first-child::before {
	content: "– ";
}

.site-sample summary .ux-mono {
	font-size: 0.75rem;
	color: var(--ux-fg-3);
}

.site-sample :deep(pre) {
	max-height: 50svh;
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
   `html.light .shiki span` and `html.dark .shiki span`, so this outranks them. */
html .site-sample :deep(pre span) {
	color: var(--shiki-dark);
	background: none;
	font-style: var(--shiki-dark-font-style);
	font-weight: var(--shiki-dark-font-weight);
	text-decoration: var(--shiki-dark-text-decoration);
}
</style>
