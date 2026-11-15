/**
 * The site's schema.org structured data, as the JSON-LD nodes useSiteHead and
 * useDocsHead put in each page's head. The homepage describes the site, its
 * publisher and the library once, and every other page points at them by `@id`.
 * There's no `SoftwareApplication`: Google's Rich Results Test reports it as an
 * error without `offers` or `aggregateRating`, and Styleframe has neither.
 */

export type JsonLdNode = Record<string, unknown>;

export interface SiteIdentity {
	/** The production origin, like https://styleframe.dev, with no trailing slash. */
	siteUrl: string;
	name: string;
	description: string;
	/** The publisher's profiles: GitHub, X, Discord, npm. */
	sameAs: string[];
	codeRepository: string;
}

/** The publisher's company. */
const PARENT_ORGANIZATION = {
	"@type": "Organization",
	"@id": "https://uxfront.com/#organization",
	name: "UXFront",
	url: "https://uxfront.com",
};

export const websiteId = (siteUrl: string) => `${siteUrl}/#website`;

export const organizationId = (siteUrl: string) => `${siteUrl}/#organization`;

/** A reference to the publisher, named so a page read on its own still says who. */
function publisher(siteUrl: string, name: string): JsonLdNode {
	return {
		"@type": "Organization",
		"@id": organizationId(siteUrl),
		name,
		url: `${siteUrl}/`,
	};
}

/** The homepage's one graph: the site, its publisher and the library. */
export function siteGraph(site: SiteIdentity): JsonLdNode {
	const { siteUrl, name, description } = site;
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": websiteId(siteUrl),
				name,
				description,
				url: `${siteUrl}/`,
				inLanguage: "en",
				publisher: { "@id": organizationId(siteUrl) },
			},
			{
				"@type": "Organization",
				"@id": organizationId(siteUrl),
				name,
				url: `${siteUrl}/`,
				logo: `${siteUrl}/android-chrome-512x512.png`,
				sameAs: site.sameAs,
				parentOrganization: PARENT_ORGANIZATION,
			},
			{
				"@type": "SoftwareSourceCode",
				"@id": `${siteUrl}/#software`,
				name,
				description,
				url: `${siteUrl}/`,
				codeRepository: site.codeRepository,
				programmingLanguage: "TypeScript",
				license: "https://opensource.org/license/mit",
				runtimePlatform: "Node.js",
				author: { "@id": organizationId(siteUrl) },
				publisher: { "@id": organizationId(siteUrl) },
			},
		],
	};
}

export interface PageData {
	siteUrl: string;
	siteName: string;
	/** The page's canonical URL. */
	url: string;
	title: string;
	description: string;
}

/** A product or legal page, part of the site. */
export function webPage(page: PageData): JsonLdNode {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": page.url,
		url: page.url,
		name: page.title,
		description: page.description,
		inLanguage: "en",
		isPartOf: { "@id": websiteId(page.siteUrl) },
	};
}

export interface ArticleData extends PageData {
	/** YYYY-MM-DD. */
	datePublished?: string;
	/** YYYY-MM-DD. */
	dateModified?: string;
}

/** A docs page or a changelog entry. */
export function techArticle(page: ArticleData): JsonLdNode {
	return {
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: page.title,
		description: page.description,
		url: page.url,
		mainEntityOfPage: { "@type": "WebPage", "@id": page.url },
		inLanguage: "en",
		...(page.datePublished && { datePublished: page.datePublished }),
		...(page.dateModified && { dateModified: page.dateModified }),
		author: publisher(page.siteUrl, page.siteName),
		publisher: publisher(page.siteUrl, page.siteName),
		isPartOf: { "@id": websiteId(page.siteUrl) },
	};
}

export interface Breadcrumb {
	title: string;
	path: string;
}

/**
 * The trail to a page. Give it only items that are pages: a sidebar group with
 * no page of its own, like Theme, would send the crawler to a 404.
 */
export function breadcrumbList(
	siteUrl: string,
	pages: Breadcrumb[],
): JsonLdNode | undefined {
	if (!pages.length) {
		return undefined;
	}

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: pages.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.title,
			item: `${siteUrl}${item.path}`,
		})),
	};
}
