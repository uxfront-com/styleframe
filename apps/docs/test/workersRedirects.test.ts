import { describe, expect, it } from "vitest";
import { dropNotFoundRedirects } from "../modules/workersRedirects";

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
