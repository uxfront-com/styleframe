<script setup lang="ts">
import { STACKED_QUERY } from "@uxfront/scene";
import { useExperience } from "@uxfront/ui";

// A chapter with its code or a picture beside the copy: UxChapter's props and
// slots, plus the aside. Like UxChapter, it holds a formation while it's on
// screen, from its stage (`data-stage`), which starts 15vh above the section:
// the formation morphs in by the time the section's top is 40% down the
// screen, which leaves the code room to fade in once it has. The stage
// carries the chapter's `id`, since the scene names the active chapter after
// it and the header marks the link to it.
const { align = "start" } = defineProps<{
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
	/** "center" centres the copy in one column, for a section with no aside. */
	align?: "start" | "center";
}>();

defineSlots<{
	lead?(): unknown;
	/** Details below the lead, like `UxTraits` or `SiteFeatures`. */
	default?(): unknown;
	/** The code or a picture, beside the copy, or below it on stacked screens. */
	aside?(): unknown;
}>();

// The code panel (`[data-code-panel]`) fades in once the code formation has
// gathered around it (`--code-reveal`, set by code.shader.ts). Only once the
// scene draws, and with motion: the prerendered page, a loading scene and the
// fallback show the code at once.
const { state } = useExperience();
const fade = computed(() => state.status === "ready" && state.motion);

// Stacked screens are the scene's, and a scoped style can't import the query,
// so the columns are set here.
const columns = `.site-split__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); }
@media ${STACKED_QUERY} { .site-split__grid { grid-template-columns: minmax(0, 1fr); } }`;
</script>

<template>
	<section
		class="site-split"
		:class="{ 'site-split--center': align === 'center' }"
		:data-fade="fade || undefined"
		:aria-labelledby="`${id}-title`"
	>
		<component :is="'style'">{{ columns }}</component>
		<div :id="id" class="site-split__stage" data-stage :data-steps="steps">
			<div class="site-split__grid">
				<div class="site-split__copy" data-reveal>
					<p v-if="index || role" class="site-split__eyebrow">
						<span>{{ index }}</span>
						<span class="site-split__rule" />
						<span>{{ role }}</span>
					</p>
					<h2 :id="`${id}-title`" class="site-split__title">{{ title }}</h2>
					<p v-if="$slots.lead" class="site-split__lead">
						<slot name="lead" />
					</p>
					<slot />
					<UxPillLink
						v-if="href"
						class="site-split__link"
						:href="href"
						:label="linkLabel ?? href.replace(/^https?:\/\//, '')"
					/>
				</div>
				<div v-if="$slots.aside" class="site-split__aside">
					<slot name="aside" />
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.site-split {
	--site-split-lead: 15vh;
	position: relative;
	display: flex;
	min-height: 100vh;
	min-height: 100svh;
	padding: 0 var(--ux-gutter);
}

/* The whole section, and 15vh above it, over the end of the one before,
   without moving the copy; the part above takes no clicks. A link to the
   chapter still lands on the section's top. */
.site-split__stage {
	scroll-margin-top: calc(-1 * var(--site-split-lead));
	display: flex;
	align-items: center;
	width: 100%;
	margin-top: calc(-1 * var(--site-split-lead));
	padding: calc(var(--site-split-lead) + 6rem) 0 5rem;
	pointer-events: none;
}

.site-split__grid {
	display: grid;
	align-items: center;
	gap: clamp(2rem, 1rem + 3vw, 4rem);
	width: 100%;
	pointer-events: auto;
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
	font-size: clamp(2.75rem, 1.2rem + 4.6vw, 5.75rem);
	font-weight: 500;
	line-height: 0.92;
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

.site-split__aside {
	min-width: 0;
}

/* In once the formation (code.ts) has gathered: hidden until its first
   frame sets `--code-reveal`. Only the opacity changes, so the panel stays
   put. */
.site-split[data-fade] .site-split__aside :deep([data-code-panel]) {
	opacity: var(--code-reveal, 0);
}

.site-split--center .site-split__grid {
	grid-template-columns: minmax(0, 1fr);
}

/* The eyebrow, title, lead and link are centred; the details below keep
   their own alignment. */
.site-split--center .site-split__copy {
	justify-self: center;
	width: min(100%, 48rem);
}

.site-split--center .site-split__eyebrow {
	justify-content: center;
}

.site-split--center .site-split__title,
.site-split--center .site-split__lead {
	text-align: center;
}

.site-split--center .site-split__link {
	display: flex;
	width: fit-content;
	margin-inline: auto;
}

/* Short screens: tighter, like UxChapter. */
@media (max-height: 860px) {
	.site-split__stage {
		padding-top: calc(var(--site-split-lead) + 5rem);
		padding-bottom: 4rem;
	}

	.site-split__eyebrow {
		margin-bottom: 1rem;
	}

	.site-split__title {
		margin-bottom: 1rem;
		font-size: clamp(2.5rem, 8vh, 5.75rem);
	}

	.site-split__lead {
		margin-bottom: 1.25rem;
	}

	.site-split__link {
		margin-top: 1.5rem;
	}
}
</style>
