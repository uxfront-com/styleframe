<script setup lang="ts">
import type { UxNavItem } from "@uxfront/ui";
import {
	CHANGELOG_URL,
	GITHUB_API_URL,
	GITHUB_URL,
	INTRODUCTION_URL,
	LOGIN_URL,
} from "~/data/site";

// The header of the site's UXFront pages: the brand, signed "by UXFront" as in
// the docs, the page's sections, and the links the docs header has.
defineProps<{
	nav?: UxNavItem[];
	navLabel?: string;
}>();

// Fetched when the page is prerendered, then refreshed in the browser once the
// page is idle. Hidden if GitHub can't be reached (its API is rate limited).
const fetchStars = () =>
	$fetch<{ stargazers_count: number }>(GITHUB_API_URL).then(
		(repo) => repo.stargazers_count,
		() => null,
	);
const { data: stars } = await useAsyncData("github-stars", fetchStars);
onNuxtReady(async () => {
	stars.value = (await fetchStars()) ?? stars.value;
});
const starCount = computed(() =>
	stars.value == null
		? null
		: new Intl.NumberFormat("en", { notation: "compact" }).format(stars.value),
);
</script>

<template>
	<UxHeader
		brand="styleframe"
		home-href="/"
		home-label="styleframe, home"
		:nav="nav"
		:nav-label="navLabel"
	>
		<template #mark>
			<img
				class="site-header__mark"
				src="/logo.svg"
				alt=""
				width="24"
				height="24"
			/>
		</template>
		<template #byline>
			by
			<a href="https://uxfront.com">
				<UxFrontMark />
				<span><strong>UX</strong>Front</span>
			</a>
		</template>
		<template #actions>
			<NuxtLink class="site-header__link" :to="INTRODUCTION_URL">Docs</NuxtLink>
			<NuxtLink class="site-header__link" :to="CHANGELOG_URL"
				>Changelog</NuxtLink
			>
			<NuxtLink class="site-header__link" :to="LOGIN_URL">Log in</NuxtLink>
			<a
				class="site-header__github"
				:href="GITHUB_URL"
				:aria-label="starCount ? `GitHub, ${stars} stars` : 'GitHub'"
			>
				<UxGithubIcon class="site-header__icon" />
				<span class="site-header__label">GitHub</span>
				<span v-if="starCount" class="site-header__stars">
					<UxStarIcon />
					{{ starCount }}
				</span>
			</a>
		</template>
	</UxHeader>
</template>

<style scoped>
.site-header__mark {
	display: block;
	width: 1.5rem;
	height: 1.5rem;
}

/* UxHeader styles its own links, not slotted ones, and the first frame has
   only the components' inline styles. */
.site-header__link,
.site-header__github {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	min-height: 2.75rem;
	text-decoration: none;
	white-space: nowrap;
}

.site-header__icon {
	width: 1.125rem;
	height: 1.125rem;
}

.site-header__stars {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.125rem 0.5rem;
	border: 1px solid var(--ux-line-strong);
	border-radius: 999px;
	font-family: var(--font-ux-mono);
	font-size: 0.75rem;
	line-height: 1rem;
	font-variant-numeric: tabular-nums;
}

.site-header__stars svg {
	width: 0.75rem;
	height: 0.75rem;
}

/* Phones can't fit the byline beside the links. The footer repeats them, and
   the GitHub link's aria-label still names it without the label. */
@media (max-width: 639px) {
	a.site-header__link,
	.site-header__label {
		display: none;
	}
}
</style>
