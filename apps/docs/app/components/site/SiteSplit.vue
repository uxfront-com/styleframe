<script setup lang="ts">
import { STACKED_QUERY } from "@uxfront/scene";

// A chapter with its code beside the copy: UxChapter's props and slots, plus
// the code. Like UxChapter, it holds a formation while it's on screen.
defineProps<{
	id: string;
	/** Eyebrow before the rule, like `01`. */
	index?: string;
	/** Eyebrow after the rule. */
	role?: string;
	title: string;
	href?: string;
	/** Label of the link; defaults to `href` without its protocol. */
	linkLabel?: string;
	/** Items (`data-step-item="0"`, `"1"`, …) highlighted one after another as the chapter scrolls by. */
	steps?: number;
}>();

defineSlots<{
	lead?(): unknown;
	/** Details below the lead, like `UxTraits` or `SiteFeatures`. */
	default?(): unknown;
	/** The code, beside the copy, or below it on stacked screens. */
	code(): unknown;
}>();

// Stacked screens are the scene's, and a scoped style can't import the query,
// so the columns are set here.
const columns = `.site-split__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); }
@media ${STACKED_QUERY} { .site-split__grid { grid-template-columns: minmax(0, 1fr); } }`;
</script>

<template>
	<section
		:id="id"
		class="site-split"
		data-stage
		:data-steps="steps"
		:aria-labelledby="`${id}-title`"
	>
		<component :is="'style'">{{ columns }}</component>
		<div class="site-split__grid">
			<div class="site-split__copy" data-reveal>
				<p v-if="index || role" class="site-split__eyebrow">
					<span>{{ index }}</span>
					<span class="site-split__rule" />
					<span>{{ role }}</span>
				</p>
				<h2 :id="`${id}-title`" class="site-split__title">{{ title }}</h2>
				<p v-if="$slots.lead" class="site-split__lead"><slot name="lead" /></p>
				<slot />
				<UxPillLink
					v-if="href"
					class="site-split__link"
					:href="href"
					:label="linkLabel ?? href.replace(/^https?:\/\//, '')"
				/>
			</div>
			<div class="site-split__code">
				<slot name="code" />
			</div>
		</div>
	</section>
</template>

<style scoped>
.site-split {
	position: relative;
	display: flex;
	align-items: center;
	min-height: 100vh;
	min-height: 100svh;
	padding: 6rem var(--ux-gutter) 5rem;
}

.site-split__grid {
	display: grid;
	align-items: center;
	gap: clamp(2rem, 1rem + 3vw, 4rem);
	width: min(100%, 84rem);
	margin: 0 auto;
}

.site-split__eyebrow {
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

.site-split__rule {
	width: 2.5rem;
	height: 1px;
	background: var(--ux-line-strong);
}

.site-split__title {
	margin: 0 0 1.5rem;
	font-size: clamp(2.5rem, 1.2rem + 3.6vw, 4.5rem);
	font-weight: 500;
	line-height: 0.95;
	letter-spacing: -0.055em;
	text-wrap: balance;
}

.site-split__lead {
	margin: 0 0 2rem;
	font-size: clamp(1.0625rem, 0.95rem + 0.4vw, 1.25rem);
	line-height: 1.45;
	color: var(--ux-fg);
	text-wrap: pretty;
}

.site-split__link {
	margin-top: 2.25rem;
}

.site-split__code {
	min-width: 0;
}

/* Short screens: tighter, like UxChapter. */
@media (max-height: 860px) {
	.site-split {
		padding-top: 5rem;
		padding-bottom: 4rem;
	}

	.site-split__eyebrow,
	.site-split__title {
		margin-bottom: 1rem;
	}

	.site-split__lead {
		margin-bottom: 1.25rem;
	}

	.site-split__link {
		margin-top: 1.5rem;
	}
}
</style>
