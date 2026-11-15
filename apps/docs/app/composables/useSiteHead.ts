import {
	DISCORD_URL,
	GITHUB_URL,
	NPM_URL,
	SITE_NAME,
	X_URL,
} from "~/data/site";

export interface SiteHeadOptions {
	/** The whole title: no title template is applied. */
	title: string;
	description: string;
	/** Path of the page, for its canonical URL. */
	path?: string;
	/** Open Graph and Twitter card image, relative to `runtimeConfig.public.siteUrl`. */
	image: { path: string; width: number; height: number; alt: string };
}

/** JSON-LD as a script body, with `<` escaped so no value can close the script. */
export function jsonLdScript(node: JsonLdNode) {
	return {
		type: "application/ld+json",
		innerHTML: JSON.stringify(node).replace(/</g, "\\u003c"),
	};
}

/**
 * The head of the homepage, a product page or a legal page: title,
 * description, canonical URL, Open Graph and Twitter cards, the dark
 * `theme-color` and `color-scheme` the UXFront pages paint with, and their
 * structured data. The homepage describes the site, its publisher and the
 * library (siteGraph), and every other page is a WebPage of the site.
 *
 * It does what `useUxHead` from `@uxfront/layer-ui` does, plus the Twitter
 * title and description and this structured data, which the layer can't set
 * yet.
 */
export function useSiteHead({
	title,
	description,
	path = "/",
	image,
}: SiteHeadOptions) {
	const { siteUrl } = useRuntimeConfig().public;
	const url = `${siteUrl}${path}`;
	const imageUrl = `${siteUrl}${image.path}`;

	useSeoMeta({
		title,
		description,
		ogTitle: title,
		ogDescription: description,
		ogUrl: url,
		ogType: "website",
		ogSiteName: SITE_NAME,
		ogImage: {
			url: imageUrl,
			width: image.width,
			height: image.height,
			alt: image.alt,
		},
		twitterCard: "summary_large_image",
		twitterTitle: title,
		twitterDescription: description,
		twitterImage: imageUrl,
	});

	const structuredData =
		path === "/"
			? siteGraph({
					siteUrl,
					name: SITE_NAME,
					description,
					sameAs: [GITHUB_URL, X_URL, DISCORD_URL, NPM_URL],
					codeRepository: GITHUB_URL,
				})
			: webPage({ siteUrl, siteName: SITE_NAME, url, title, description });

	useHead({
		titleTemplate: null,
		meta: [
			{ name: "theme-color", content: "#050507" },
			{ name: "color-scheme", content: "dark" },
		],
		link: [{ rel: "canonical", href: url }],
		script: [jsonLdScript(structuredData)],
	});
}
