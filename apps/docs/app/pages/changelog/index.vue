<script setup lang="ts">
// Every entry, newest first, with its notes in full. The page is prerendered, so
// search engines, in-page search and readers without JavaScript all see them.
const { data: entries } = await useAsyncData("changelog", () =>
	queryCollection("changelog").order("date", "DESC").all(),
);

const title = "Changelog";
const description =
	"Everything new in Styleframe — recipes, engine improvements, and tooling, release by release.";

useSeo({ title, description, type: "website" });
defineOgImage("Docs.takumi", { headline: "styleframe", title, description });
</script>

<template>
	<UContainer class="py-12 lg:py-16">
		<div class="mx-auto max-w-2xl">
			<h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
				{{ title }}
			</h1>
			<p class="mt-3 mb-8 text-muted">{{ description }}</p>

			<article
				v-for="entry in entries"
				:key="entry.path"
				class="border-t border-default py-12"
			>
				<ChangelogEntry :entry="entry" listed>
					<template #title>
						<h2 class="mt-4 text-2xl font-semibold text-highlighted">
							<NuxtLink :to="entry.path" class="hover:text-primary">{{
								entry.title
							}}</NuxtLink>
						</h2>
					</template>
				</ChangelogEntry>
			</article>
		</div>
	</UContainer>
</template>
