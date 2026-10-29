import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Every `/raw/<path>.md` link in `llms.txt` is a file in the static output.
 *
 * Agents follow these links, and on Vercel, Docus turns each one into a rule
 * that sends `curl` and `Accept: text/markdown` requests for the page to it
 * (`modules/vercel-markdown-rewrite.ts` in Docus). The site is static, so a
 * link with no file is a 404 for the agent and, through that rule, for the
 * page itself.
 *
 * Requires a prior build; runs via `test:build` (see `vitest.build.config.ts`).
 */

const OUTPUT = fileURLToPath(new URL("../.output/public", import.meta.url));

function rawLinks(): string[] {
	const file = join(OUTPUT, "llms.txt");
	if (!existsSync(file)) {
		return [];
	}

	return [...readFileSync(file, "utf8").matchAll(/\]\((https?:\/\/[^)]+)\)/g)]
		.map((match) => new URL(match[1]!).pathname)
		.filter((path) => path.startsWith("/raw/"));
}

describe("llms.txt raw links", () => {
	const links = rawLinks();

	it("finds the raw links in the build", () => {
		expect(links.length).toBeGreaterThan(0);
	});

	it.each(links)("%s is in the static output", (path) => {
		expect(existsSync(join(OUTPUT, path))).toBe(true);
	});
});
