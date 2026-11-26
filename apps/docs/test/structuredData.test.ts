import { describe, expect, it } from "vitest";

import { breadcrumbList, siteGraph, techArticle, webPage } from "../app/utils/structuredData";

const SITE = "https://styleframe.dev";
const page = {
	siteUrl: SITE,
	siteName: "Styleframe",
	url: `${SITE}/docs/theme/components/button`,
	title: "Button",
	description: "An interactive control.",
};

describe("siteGraph", () => {
	const graph = siteGraph({
		siteUrl: SITE,
		name: "Styleframe",
		description: "A type-safe styling engine.",
		sameAs: ["https://github.com/uxfront-com/styleframe"],
		codeRepository: "https://github.com/uxfront-com/styleframe",
	})["@graph"] as Array<Record<string, unknown>>;

	it("describes the site, its publisher and the library", () => {
		expect(graph.map((node) => node["@type"])).toEqual([
			"WebSite",
			"Organization",
			"SoftwareSourceCode",
		]);
	});

	it("links every node to the publisher, which belongs to UXFront", () => {
		const [website, organization, software] = graph;
		const publisher = { "@id": `${SITE}/#organization` };
		expect(organization!["@id"]).toBe(publisher["@id"]);
		expect(website!["@id"]).toBe(`${SITE}/#website`);
		expect(website!.publisher).toEqual(publisher);
		expect(software!.publisher).toEqual(publisher);
		expect(software!.author).toEqual(publisher);
		expect(organization!.parentOrganization).toMatchObject({
			"@type": "Organization",
			name: "UXFront",
		});
	});

	it("never describes a SoftwareApplication", () => {
		expect(JSON.stringify(graph)).not.toContain("SoftwareApplication");
	});
});

describe("webPage", () => {
	it("is part of the site and names no organisation of its own", () => {
		const node = webPage(page);
		expect(node).toMatchObject({
			"@type": "WebPage",
			"@id": page.url,
			isPartOf: { "@id": `${SITE}/#website` },
		});
		expect(JSON.stringify(node)).not.toContain('"Organization"');
	});
});

describe("techArticle", () => {
	it("points at the publisher and the site, with its dates", () => {
		expect(techArticle({ ...page, dateModified: "2026-11-15" })).toMatchObject({
			"@type": "TechArticle",
			headline: "Button",
			url: page.url,
			dateModified: "2026-11-15",
			publisher: { "@id": `${SITE}/#organization` },
			isPartOf: { "@id": `${SITE}/#website` },
		});
	});

	it("leaves out the dates it doesn't have", () => {
		const node = techArticle(page);
		expect(node).not.toHaveProperty("dateModified");
		expect(node).not.toHaveProperty("datePublished");
	});
});

describe("breadcrumbList", () => {
	it("numbers the pages and links each on the site", () => {
		expect(
			breadcrumbList(SITE, [
				{ title: "Components", path: "/docs/theme/components" },
				{ title: "Button", path: "/docs/theme/components/button" },
			]),
		).toEqual({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Components",
					item: `${SITE}/docs/theme/components`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Button",
					item: `${SITE}/docs/theme/components/button`,
				},
			],
		});
	});

	it("is left out with no pages", () => {
		expect(breadcrumbList(SITE, [])).toBeUndefined();
	});
});
