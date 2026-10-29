<script setup lang="ts">
// A grid of features that light up one after another, like UxTraits (set
// `steps` on the UxChapter to their count). A feature with `to` is a link.
defineProps<{
	items: { title: string; text: string; to?: string }[];
}>();
</script>

<template>
	<ul class="site-features">
		<li v-for="(item, i) in items" :key="item.title" :data-step-item="i">
			<NuxtLink v-if="item.to" :to="item.to" class="site-features__item">
				<strong>{{ item.title }}</strong>
				<span>{{ item.text }}</span>
			</NuxtLink>
			<div v-else class="site-features__item">
				<strong>{{ item.title }}</strong>
				<span>{{ item.text }}</span>
			</div>
		</li>
	</ul>
</template>

<style scoped>
.site-features {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1px;
	margin: 0;
	padding: 0;
	list-style: none;
	border: 1px solid var(--ux-line);
	background: var(--ux-line);
}

.site-features__item {
	display: grid;
	align-content: start;
	gap: 0.4rem;
	height: 100%;
	padding: 1rem 1.1rem 1.15rem;
	font-size: 0.875rem;
	line-height: 1.45;
	color: color-mix(in srgb, var(--ux-fg-2) calc(var(--active, 0) * 100%), var(--ux-fg-3));
	text-decoration: none;
	background: color-mix(
		in srgb,
		rgb(255 255 255 / 0.06) calc(var(--active, 0) * 100%),
		var(--ux-bg)
	);
	transition: background 0.5s var(--ux-ease-out);
}

a.site-features__item:hover {
	background: rgb(255 255 255 / 0.08);
}

.site-features strong {
	font-size: 1rem;
	font-weight: 500;
	letter-spacing: -0.01em;
	color: var(--ux-fg);
}

a.site-features__item strong::after {
	content: " →";
	color: var(--ux-fg-3);
}

@media (max-width: 760px) {
	.site-features {
		grid-template-columns: 1fr;
	}

	.site-features__item {
		padding: 0.7rem 0.9rem;
	}
}
</style>
