import { describe, expect, it } from "vitest";
import {
	addHostRules,
	countHeaderRules,
	dropNotFoundRedirects,
	HOST_RULES,
	MAX_HEADER_RULES,
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

/**
 * The `_headers` Nitro writes for the docs build, before the host rules: its
 * path rules, in the order it writes them, deepest first.
 */
const NITRO_HEADERS = [
	"/_nuxt/builds/meta/*",
	"  cache-control: public, max-age=31536000, immutable",
	"/_nuxt/builds/*",
	"  cache-control: public, max-age=1, immutable",
	"/raw/*",
	"  X-Robots-Tag: noindex",
	"/_nuxt/*",
	"  cache-control: public, max-age=31536000, immutable",
	"  X-Robots-Tag: noindex",
	"/_nuxt",
	"  X-Robots-Tag: noindex",
	"/*",
	"  X-Frame-Options: DENY",
	"",
].join("\n");

interface Rule {
	set: Record<string, string>;
	unset: string[];
}

/** Parses `_headers` into rules keyed by URL, as Cloudflare's parser does. */
function parseHeaders(headers: string): Record<string, Rule> {
	const rules: Record<string, Rule> = {};
	let rule: Rule | undefined;
	for (const raw of headers.split("\n")) {
		const line = raw.trim();
		if (!line || line.startsWith("#")) continue;
		if (/^(\S+:\/\/|\/)/.test(line)) {
			rule = rules[line] ?? { set: {}, unset: [] };
			rules[line] = rule;
		} else if (line.startsWith("! ")) {
			rule?.unset.push(line.slice(2).toLowerCase());
		} else {
			const [name = "", ...value] = line.split(":");
			const key = name.trim().toLowerCase();
			const prev = rule?.set[key];
			if (rule) {
				rule.set[key] = prev
					? `${prev}, ${value.join(":").trim()}`
					: value.join(":").trim();
			}
		}
	}
	return rules;
}

/** Cloudflare's rule pattern: `*` is a splat, a host placeholder stops at `.`. */
function ruleRegExp(rule: string): RegExp {
	const escaped = rule
		.split("*")
		.map((part) => part.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&"))
		.join(".*")
		.replace(/(?<=^https:\\\/\\\/[^/]*?):[A-Za-z]\w*/g, "[^/.]+")
		.replace(/:[A-Za-z]\w*/g, "[^/]+");
	return new RegExp(`^${escaped}$`);
}

/**
 * The `X-Robots-Tag` a URL is sent: each matching rule detaches, then sets or
 * joins, in the order given, as Cloudflare's asset worker does.
 */
function robotsTag(
	rules: Record<string, Rule>,
	order: string[],
	url: string,
): string | null {
	const { hostname, pathname } = new URL(url);
	let value: string | null = null;
	let wasSet = false;
	for (const key of order) {
		const test = key.startsWith("https://")
			? `https://${hostname}${pathname}`
			: pathname;
		if (!ruleRegExp(key).test(test)) continue;
		const { set, unset } = rules[key] as Rule;
		if (unset.includes("x-robots-tag")) value = null;
		const added = set["x-robots-tag"];
		if (added) {
			value = wasSet && value ? `${value}, ${added}` : added;
			wasSet = true;
		}
	}
	return value;
}

/**
 * Production stores the rules keyed by URL and applies them in sorted key
 * order, which the deployed version's config shows. `wrangler dev` keeps the
 * file's order.
 */
const ORDERS = {
	"Cloudflare's sorted order": (rules: Record<string, Rule>) =>
		Object.keys(rules).sort(),
	"the file's order": (rules: Record<string, Rule>) => Object.keys(rules),
};

describe.each(Object.entries(ORDERS))(
	"the built _headers, applied in %s",
	(_name, order) => {
		const rules = parseHeaders(addHostRules(NITRO_HEADERS));
		const tag = (url: string) => robotsTag(rules, order(rules), url);

		it("keeps production's pages indexable", () => {
			expect(tag("https://styleframe.dev/")).toBeNull();
			expect(tag("https://styleframe.dev/docs/api/variables")).toBeNull();
			expect(tag("https://styleframe.dev/llms.txt")).toBeNull();
			expect(tag("https://styleframe.dev/_nuxt/entry.js")).toBeNull();
			expect(tag("https://styleframe.dev/_nuxt")).toBeNull();
		});

		it("sends noindex once on production's /raw/ copies", () => {
			expect(tag("https://styleframe.dev/raw/docs/api/variables.md")).toBe(
				"noindex",
			);
			expect(tag("https://styleframe.dev/raw/index.md")).toBe("noindex");
		});

		it("sends noindex on www's /raw/ copies only", () => {
			expect(tag("https://www.styleframe.dev/")).toBeNull();
			expect(tag("https://www.styleframe.dev/raw/index.md")).toBe("noindex");
		});

		it.each([
			"https://7c854e4d.styleframe.dev",
			"https://my-branch.styleframe.dev",
			"https://7c854e4d-styleframe.blue-water-0397.workers.dev",
			"https://styleframe.blue-water-0397.workers.dev",
		])("sends noindex on every path of the Preview host %s", (origin) => {
			for (const path of ["/", "/docs/api/variables", "/raw/index.md"]) {
				expect(tag(`${origin}${path}`)?.split(", ")).toContain("noindex");
			}
		});
	},
);

describe("addHostRules", () => {
	it("puts the host rules after every path rule, in sorted order", () => {
		const urls = addHostRules(NITRO_HEADERS)
			.split("\n")
			.filter((line) => /^(\S+:\/\/|\/)/.test(line));
		const hosts = urls.filter((url) => url.startsWith("https://"));

		expect(urls.slice(-hosts.length)).toEqual(hosts);
		expect(hosts).toEqual([...hosts].sort());
		expect(hosts).toEqual([
			"https://:preview.styleframe.dev/*",
			"https://:version.:subdomain.workers.dev/*",
			"https://styleframe.dev/*",
			"https://styleframe.dev/raw/*",
			"https://www.styleframe.dev/*",
			"https://www.styleframe.dev/raw/*",
		]);
	});

	it("keeps Nitro's rules as they are", () => {
		expect(addHostRules(NITRO_HEADERS).startsWith(NITRO_HEADERS.trim())).toBe(
			true,
		);
	});

	it("adds them once, however often the build runs", () => {
		const once = addHostRules(NITRO_HEADERS);
		expect(addHostRules(once)).toBe(once);
	});

	it("writes the host rules alone when there are no others", () => {
		expect(addHostRules("")).toBe(`${HOST_RULES}\n`);
		expect(addHostRules("\n  \n")).toBe(`${HOST_RULES}\n`);
	});

	it("fails the build rather than let Cloudflare drop the host rules", () => {
		const hostRules = countHeaderRules(HOST_RULES);
		const rule = (n: number) => `/path-${n}/*\n  cache-control: no-store`;
		const fill = (count: number) =>
			Array.from({ length: count }, (_, n) => rule(n)).join("\n");

		expect(() =>
			addHostRules(fill(MAX_HEADER_RULES - hostRules)),
		).not.toThrow();
		expect(() => addHostRules(fill(MAX_HEADER_RULES - hostRules + 1))).toThrow(
			/101 rules/,
		);
	});
});
