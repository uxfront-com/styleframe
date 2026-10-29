<script setup lang="ts">
// One entry, from content/changelog/<version>.md. nuxt.config.ts lists every
// entry for prerendering, since the crawler skips links like /changelog/3.9.0.
const route = useRoute();
const path = `/changelog/${route.params.slug}`;

const { data: entry } = await useAsyncData(path, () =>
	queryCollection("changelog").path(path).first(),
);

if (!entry.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "Page not found",
		fatal: true,
	});
}

const title = `${entry.value.title} — v${entry.value.version}`;

useSeo({
	title,
	description: entry.value.description,
	publishedAt: entry.value.date,
});
defineOgImage("Docs.takumi", {
	headline: "Changelog",
	title,
	description: entry.value.description,
});
</script>

<template>
	<UContainer v-if="entry" class="py-12 lg:py-16">
		<div class="mx-auto max-w-2xl">
			<NuxtLink
				to="/changelog"
				class="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-default"
			>
				<UIcon name="i-lucide-arrow-left" class="size-4" />
				Back to the changelog
			</NuxtLink>

			<ChangelogEntry :entry="entry">
				<template #title>
					<h1 class="mt-4 text-3xl font-bold text-highlighted sm:text-4xl">
						{{ entry.title }}
					</h1>
				</template>
			</ChangelogEntry>
		</div>
	</UContainer>
</template>
