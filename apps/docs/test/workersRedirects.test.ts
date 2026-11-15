import { describe, expect, it } from "vitest";
import {
	addPreviewHostsRule,
	dropNotFoundRedirects,
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

describe("addPreviewHostsRule", () => {
	const rule = [
		"https://:version.:subdomain.workers.dev/*",
		"  X-Robots-Tag: noindex",
	].join("\n");

	it("adds the rule after the ones Nitro writes", () => {
		const headers = "/raw/*\n  X-Robots-Tag: noindex\n";
		expect(addPreviewHostsRule(headers)).toBe(`${headers}${rule}\n`);
	});

	it("writes the rule alone when there are no others", () => {
		expect(addPreviewHostsRule("")).toBe(`${rule}\n`);
	});

	it("adds it once, however often the build runs", () => {
		const once = addPreviewHostsRule("/*\n  X-Frame-Options: DENY\n");
		expect(addPreviewHostsRule(once)).toBe(once);
	});
});
