<script setup lang="ts">
import type { UxTrait } from "@uxfront/ui";

defineProps<{ items: UxTrait[] }>();
</script>

<template>
	<!-- A strip of features: columns of a title over muted text, split by
	     hairlines, on a scrim that keeps it legible over the scene. A cell with
	     `href` is a link. -->
	<ul class="site-features">
		<template v-for="item in items" :key="item.title">
			<li v-if="item.href" class="site-features__linked">
				<a class="site-features__link" :href="item.href">
					<strong>{{ item.title }}</strong>
					<span>{{ item.text }}</span>
				</a>
			</li>
			<li v-else>
				<strong>{{ item.title }}</strong>
				<span>{{ item.text }}</span>
			</li>
		</template>
	</ul>
</template>

<style scoped>
.site-features {
	--site-features-inset: clamp(1rem, 2.5vw, 3rem);
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	row-gap: 2rem;
	padding: 3rem var(--ux-gutter);
	list-style: none;
	background: rgb(5 5 7 / 0.82);
	backdrop-filter: blur(12px);
	text-shadow: none;
}

/* The hairline, and the inset after it. The first cell of a row has neither,
   so its text starts at the gutter, under the section's heading. */
.site-features li {
	--site-features-start: var(--site-features-inset);
	border-left: 1px solid var(--ux-line);
}

.site-features li:nth-child(3n + 1) {
	--site-features-start: 0;
	border-left: 0;
}

.site-features li,
.site-features__link {
	display: grid;
	align-content: start;
	gap: 0.4rem;
	padding: 0.25rem var(--site-features-inset) 0.25rem
		var(--site-features-start);
	font-size: 0.875rem;
	line-height: 1.45;
	color: var(--ux-fg-3);
}

/* A linked cell is the link, edge to edge. */
.site-features .site-features__linked {
	display: block;
	padding: 0;
}

.site-features__link {
	height: 100%;
	text-decoration: none;
}

.site-features strong {
	font-size: 1rem;
	font-weight: 500;
	letter-spacing: -0.01em;
	color: var(--ux-fg);
}

.site-features span {
	text-wrap: pretty;
	transition: color 0.3s var(--ux-ease-out);
}

.site-features__link:hover span {
	color: var(--ux-fg-2);
}

/* STACKED_QUERY in @uxfront/scene: two columns, on the screens the scene
   stacks. */
@media (max-aspect-ratio: 5/4), (max-width: 1099px) and (max-aspect-ratio: 8/5) {
	.site-features {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.site-features li:nth-child(n) {
		--site-features-start: var(--site-features-inset);
		border-left: 1px solid var(--ux-line);
	}

	.site-features li:nth-child(2n + 1) {
		--site-features-start: 0;
		border-left: 0;
	}
}

/* Six cells have to stay short on a phone, so the spacing tightens. */
@media (max-width: 760px) {
	.site-features {
		--site-features-inset: 0;
		grid-template-columns: minmax(0, 1fr);
		row-gap: 1rem;
		padding-block: 2rem;
	}

	.site-features li:nth-child(n) {
		border-left: 0;
	}
}
</style>
