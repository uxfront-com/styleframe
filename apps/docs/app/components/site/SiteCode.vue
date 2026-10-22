<script setup lang="ts">
// A code sample in a window frame, named after its file.
defineProps<{
	title: string;
	code: string;
}>();
</script>

<template>
	<figure class="site-code">
		<figcaption class="ux-mono">{{ title }}</figcaption>
		<pre><code>{{ code }}</code></pre>
	</figure>
</template>

<style scoped>
.site-code {
	margin: 0;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
	background: rgb(5 5 7 / 0.85);
	backdrop-filter: blur(10px);
	overflow: hidden;
}

.site-code figcaption {
	padding: 0.6rem 1rem;
	color: var(--ux-fg-3);
	border-bottom: 1px solid var(--ux-line);
}

.site-code pre {
	margin: 0;
	padding: 1rem;
	overflow-x: auto;
	font-family: var(--font-ux-mono);
	font-size: 0.8125rem;
	line-height: 1.6;
	color: var(--ux-fg-2);
	text-shadow: none;
}
</style>
