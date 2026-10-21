<script setup lang="ts">
// A section with a chapter's heading and room for wide content, like the plans
// or the FAQ, on a panel that keeps it legible over the scene. Like UxChapter,
// it holds a formation while it's on screen.
defineProps<{
	id: string;
	/** Eyebrow before the rule, like `01`. */
	index?: string;
	/** Eyebrow after the rule. */
	role?: string;
	title: string;
}>();

defineSlots<{
	lead?(): unknown;
	default(): unknown;
}>();
</script>

<template>
	<section
		:id="id"
		class="site-section"
		data-stage
		:aria-labelledby="`${id}-title`"
	>
		<div class="site-section__head" data-reveal>
			<p v-if="index || role" class="site-section__eyebrow">
				<span>{{ index }}</span>
				<span class="site-section__rule" />
				<span>{{ role }}</span>
			</p>
			<h2 :id="`${id}-title`" class="site-section__title">{{ title }}</h2>
			<p v-if="$slots.lead" class="site-section__lead"><slot name="lead" /></p>
		</div>
		<div class="site-section__panel">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.site-section {
	position: relative;
	min-height: 100vh;
	min-height: 100svh;
	padding: 8rem var(--ux-gutter) 6rem;
}

.site-section__head,
.site-section__panel {
	width: min(100%, 72rem);
	margin: 0 auto;
}

.site-section__head {
	margin-bottom: 2.5rem;
}

.site-section__eyebrow {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin: 0 0 1.5rem;
	font-family: var(--font-ux-mono);
	font-size: 0.75rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--ux-fg-2);
}

.site-section__rule {
	width: 2.5rem;
	height: 1px;
	background: var(--ux-line-strong);
}

.site-section__title {
	max-width: 48rem;
	margin: 0 0 1.25rem;
	font-size: clamp(2.5rem, 1.2rem + 3.6vw, 4.5rem);
	font-weight: 500;
	line-height: 0.95;
	letter-spacing: -0.055em;
	text-wrap: balance;
}

.site-section__lead {
	max-width: 40rem;
	font-size: clamp(1.0625rem, 0.95rem + 0.4vw, 1.25rem);
	line-height: 1.45;
	color: var(--ux-fg-2);
	text-wrap: pretty;
}

.site-section__panel {
	padding: clamp(1rem, 0.5rem + 2vw, 2rem);
	border: 1px solid var(--ux-line);
	border-radius: 8px;
	background: rgb(5 5 7 / 0.82);
	backdrop-filter: blur(12px);
	text-shadow: none;
}
</style>
