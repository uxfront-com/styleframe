<script setup lang="ts">
import type { ChangelogCollectionItem } from "@nuxt/content";
import type { Component, FunctionalComponent } from "vue";
import { ProseH3, ProseH4 } from "#components";

/**
 * One changelog entry: its version and date, the title (the `title` slot, an
 * `<h2>` linking to the entry on /changelog and the page's `<h1>` on its own),
 * its notes and the link to its GitHub release.
 */
const props = defineProps<{
	entry: ChangelogCollectionItem;
	// On /changelog, which lists every entry.
	listed?: boolean;
}>();

// On /changelog, the notes' headings lose their ids, which every entry's New
// section would share.
const listedHeading =
	(heading: Component): FunctionalComponent =>
	(_props, { slots }) =>
		h(heading, null, slots);
const listedHeadings = {
	h3: listedHeading(ProseH3),
	h4: listedHeading(ProseH4),
};

// Entries are dated like 2026-06-14, which Date reads as midnight UTC: formatted
// in UTC, it's the same day in every time zone, on the server and in the browser.
const date = new Intl.DateTimeFormat("en-US", {
	dateStyle: "long",
	timeZone: "UTC",
}).format(new Date(props.entry.date));

const releaseUrl = useChangelogReleaseUrl();
</script>

<template>
	<div class="flex items-center gap-3">
		<UBadge
			:label="`v${entry.version}`"
			color="primary"
			variant="subtle"
			size="lg"
		/>
		<time :datetime="entry.date" class="text-sm text-muted">{{ date }}</time>
	</div>

	<slot name="title" />

	<ContentRenderer
		:value="entry"
		:components="listed ? listedHeadings : undefined"
		class="mt-4"
	/>

	<NuxtLink
		:to="releaseUrl(entry)"
		target="_blank"
		rel="noopener"
		class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
	>
		<UIcon name="i-simple-icons-github" class="size-4" />
		View the v{{ entry.version }} release on GitHub
		<UIcon name="i-lucide-arrow-up-right" class="size-3.5" />
	</NuxtLink>
</template>
