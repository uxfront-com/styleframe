import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { latestDate, SITE_PAGES } from "../server/lib/pages";

const APP = fileURLToPath(new URL("..", import.meta.url));

describe("SITE_PAGES", () => {
	it.each(SITE_PAGES.flatMap((page) => page.sources))("%s is a file in the app", (source) => {
		expect(existsSync(`${APP}/${source}`)).toBe(true);
	});

	it("lists /pro and /pricing", () => {
		const paths = SITE_PAGES.map((page) => page.path);
		expect(paths).toContain("/pro");
		expect(paths).toContain("/pricing");
	});
});

describe("latestDate", () => {
	it("picks the newest date", () => {
		expect(latestDate(["2026-01-02", undefined, "2026-03-04"])).toBe("2026-03-04");
	});

	it("is undefined with no dates", () => {
		expect(latestDate([undefined])).toBeUndefined();
	});
});
