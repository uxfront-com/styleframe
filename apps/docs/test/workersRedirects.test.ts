import { describe, expect, it } from "vitest";
import {
	addHostRules,
	dropNotFoundRedirects,
	HOST_RULES,
} from "../modules/workersRedirects";

describe("dropNotFoundRedirects", () => {
	it("drops the 404 fallback Nitro writes for Cloudflare Pages", () => {
		const redirects = [
			"/docs\t/docs/getting-started/introduction\t307",
			"/*\t/404.html\t404",
		].join("\n");

		expect(dropNotFoundRedirects(redirects)).toBe(
			"/docs\t/docs/getting-started/introduction\t307",
		);
	});

	it("keeps every other rule, in order", () => {
		const redirects = [
			"/a\t/b\t301",
			"/c /d",
			"/e\thttps://example.com/f\t308",
		].join("\n");

		expect(dropNotFoundRedirects(redirects)).toBe(redirects);
	});
});

describe("addHostRules", () => {
	const nitro =
		"/raw/*\n  X-Robots-Tag: noindex\n/*\n  X-Frame-Options: DENY\n";

	it("puts the host rules first, in the order that keeps production indexable", () => {
		const headers = addHostRules(nitro);
		const urls = headers
			.split("\n")
			.filter((line) => line && !/^\s/.test(line));

		expect(urls).toEqual([
			"https://:version.:subdomain.workers.dev/*",
			"https://:preview.styleframe.dev/*",
			"https://www.styleframe.dev/*",
			"https://styleframe.dev/*",
			"/raw/*",
			"/*",
		]);
		expect(headers).toContain("https://www.styleframe.dev/*\n  ! X-Robots-Tag");
		expect(headers).toContain("https://styleframe.dev/*\n  ! X-Robots-Tag");
		expect(headers.endsWith(nitro)).toBe(true);
	});

	it("adds them once, however often the build runs", () => {
		const once = addHostRules(nitro);
		expect(addHostRules(once)).toBe(once);
	});

	it("writes the host rules alone when there are no others", () => {
		expect(addHostRules("")).toBe(`${HOST_RULES}\n`);
	});
});
