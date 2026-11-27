<script setup lang="ts">
/**
 * Replaces Docus's docs page (docus/app/pages/[[lang]]/[...slug].vue) so "Edit
 * this page" opens the page's file. Docus builds the link from the page's
 * `stem`, which modules/nonRouteCategories.ts gives the section in front, for
 * the sidebar and the previous and next links: the file is at
 * docsSourceStem(stem). Its head is useDocsHead's, in place of Docus's
 * `useSeo`, for the Twitter tags, a TechArticle dated by the file's last commit,
 * and breadcrumbs that are all pages. Keep the rest in step with Docus's. Docus's keys its
 * data by the path in kebab case, with scule, which isn't the app's dependency:
 * this one keys it by the path.
 */
import type {
	ContentNavigationItem,
	Collections,
	DocsCollectionItem,
	PageCollections,
} from "@nuxt/content";
import { findPageHeadline } from "@nuxt/content/utils";
import { docsSourceStem } from "~/constants/sections";

definePageMeta({
	layout: "docs",
});

const route = useRoute();
const { locale, isEnabled, t } = useDocusI18n();
const { isOpen } = useAssistant();
const appConfig = useAppConfig();
const navigation = inject<Ref<Array<ContentNavigationItem>>>("navigation");
const collectionName = computed(() =>
	isEnabled.value ? `docs_${locale.value}` : "docs",
);

const [{ data: page }, { data: surround }] = await Promise.all([
	useAsyncData(
		route.path,
		() =>
			queryCollection(collectionName.value as keyof Collections)
				.path(route.path)
				.first() as Promise<DocsCollectionItem>,
	),
	useAsyncData(`${route.path}-surround`, () => {
		return queryCollectionItemSurroundings(
			collectionName.value as keyof PageCollections,
			route.path,
			{
				fields: ["description"],
			},
		);
	}),
]);

if (!page.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "Page not found",
		fatal: true,
	});
}

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

const headline = ref(findPageHeadline(navigation?.value, page.value?.path));

// The trail in the sidebar, less the groups that have no page of their own,
// like Theme, so every item in the BreadcrumbList is a page.
const trail = findPageBreadcrumbs(navigation?.value, page.value.path) ?? [];
const { data: trailPages } = await useAsyncData(
	`${route.path}-breadcrumbs`,
	async () => {
		const paths = trail.map((item) => item.path);
		if (!paths.length) {return [];}
		const pages = await queryCollection(
			collectionName.value as keyof PageCollections,
		)
			.where("path", "IN", paths)
			.select("path")
			.all();
		return pages.map((item) => item.path);
	},
);

const dateModified = await useGitDate(
	`content/${docsSourceStem(page.value.stem)}.${page.value.extension}`,
);

useDocsHead({
	title,
	description,
	type: "article",
	dateModified,
	breadcrumbs: () =>
		trail.filter((item) => trailPages.value?.includes(item.path)),
});
watch(
	() => navigation?.value,
	() => {
		headline.value =
			findPageHeadline(navigation?.value, page.value?.path) || headline.value;
	},
);

defineOgImage("Docs", {
	headline: headline.value,
	title: title?.slice(0, 60),
	description: formatOgDescription(title, description),
});

const github = computed(() => (appConfig.github ? appConfig.github : null));

const editLink = computed(() => {
	if (!github.value) {
		return;
	}

	return [
		github.value.url,
		"edit",
		github.value.branch,
		github.value.rootDir,
		"content",
		`${docsSourceStem(page.value?.stem ?? "")}.${page.value?.extension}`,
	]
		.filter(Boolean)
		.join("/");
});
</script>

<template>
	<UPage v-if="page" :ui="isOpen ? { center: 'lg:col-span-10' } : undefined">
		<UPageHeader
			:title="page.title"
			:description="page.description"
			:headline="headline"
			:ui="{
				wrapper: 'flex-row items-center flex-wrap justify-between',
			}"
		>
			<template #links>
				<UButton
					v-for="(link, index) in (page as DocsCollectionItem).links"
					:key="index"
					size="sm"
					v-bind="link"
				/>

				<DocsPageHeaderLinks />
			</template>
		</UPageHeader>

		<UPageBody>
			<ContentRenderer v-if="page" :value="page" />

			<!-- Decorative, as it holds links: a separator's content isn't
			     reachable by assistive technology. -->
			<USeparator v-if="github" decorative>
				<div class="flex items-center gap-2 text-sm text-muted">
					<UButton
						variant="link"
						color="neutral"
						:to="editLink"
						target="_blank"
						icon="i-lucide-pen"
						:ui="{ leadingIcon: 'size-4' }"
					>
						{{ t('docs.edit') }}
					</UButton>
					<template v-if="github?.url">
						<span>{{ t('common.or') }}</span>
						<UButton
							variant="link"
							color="neutral"
							:to="`${github.url}/issues/new/choose`"
							target="_blank"
							icon="i-lucide-alert-circle"
							:ui="{ leadingIcon: 'size-4' }"
						>
							{{ t('docs.report') }}
						</UButton>
					</template>
				</div>
			</USeparator>
			<UContentSurround :surround="surround" />
		</UPageBody>

		<template v-if="!isOpen" #right>
			<DocsAsideRight :page="page" />
		</template>
	</UPage>
</template>
