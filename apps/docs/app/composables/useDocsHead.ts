import type { MaybeRefOrGetter } from "vue";
import { SITE_NAME } from "~/data/site";

export interface DocsHeadOptions {
	/** The page's own title: the app's title template adds the site's name. */
	title: string;
	description: string;
	/** `article` for a docs page or a changelog entry, `page` for a list of them. */
	type: "article" | "page";
	/** YYYY-MM-DD. */
	datePublished?: MaybeRefOrGetter<string | undefined>;
	/** YYYY-MM-DD. */
	dateModified?: MaybeRefOrGetter<string | undefined>;
	/** The trail to the page, only pages: see breadcrumbList. */
	breadcrumbs?: MaybeRefOrGetter<Array<Breadcrumb> | undefined>;
}

/**
 * The head of a docs page or a changelog page, in place of Docus's `useSeo`:
 * title, description, canonical URL, Open Graph and Twitter tags, and the
 * structured data, a TechArticle or a WebPage, with its BreadcrumbList. The
 * social card comes from the page's `defineOgImage`.
 */
export function useDocsHead(options: DocsHeadOptions) {
	const route = useRoute();
	const { siteUrl } = useRuntimeConfig().public;
	const url = `${siteUrl}${route.path}`;
	const { title, description } = options;

	useSeoMeta({
		title,
		description,
		ogTitle: title,
		ogDescription: description,
		ogType: options.type === "article" ? "article" : "website",
		ogUrl: url,
		twitterTitle: title,
		twitterDescription: description,
	});

	useHead({
		link: [{ rel: "canonical", href: url }],
		script: computed(() => {
			const page = { siteUrl, siteName: SITE_NAME, url, title, description };
			const breadcrumbs = breadcrumbList(
				siteUrl,
				toValue(options.breadcrumbs) ?? [],
			);
			return [
				options.type === "article"
					? techArticle({
							...page,
							datePublished: toValue(options.datePublished),
							dateModified: toValue(options.dateModified),
						})
					: webPage(page),
				...(breadcrumbs ? [breadcrumbs] : []),
			].map(jsonLdScript);
		}),
	});
}
