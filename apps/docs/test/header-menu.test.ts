import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The docs header's menu (AppHeaderBody) lists the sections the tabs below
 * the header (AppHeaderBottom) show, from the same `useDocsSections().tabs`,
 * wherever the tabs are hidden: the tabs show from Nuxt UI's `lg`, and the
 * menu only opens below it, so the menu's list has no breakpoint of its own.
 */

const read = (name: string) =>
	readFileSync(
		new URL(`../app/components/app/${name}.vue`, import.meta.url),
		"utf8",
	);

// The <UNavigationMenu> whose items are `tabs`, and the variable `tabs`
// comes from.
const tabsMenu = (source: string) => ({
	source: source.match(/const \{ tabs \} = (\w+)\(\);/)?.[1],
	menu: source.match(/<UNavigationMenu\b[^>]*:items="tabs"[^>]*>/)?.[0] ?? "",
});

describe("the docs' sections", () => {
	const bar = tabsMenu(read("AppHeaderBottom"));
	const menu = tabsMenu(read("AppHeaderBody"));

	it("come from useDocsSections() in the tabs and in the menu", () => {
		expect(bar.source).toBe("useDocsSections");
		expect(menu.source).toBe("useDocsSections");
	});

	it("show as tabs from lg, and in the menu at every width it opens", () => {
		expect(read("AppHeaderBottom")).toMatch(
			/<UContainer class="hidden lg:flex[^"]*">\s*<UNavigationMenu\b[^>]*:items="tabs"/,
		);
		expect(menu.menu).not.toBe("");
		expect(menu.menu).not.toMatch(/\bhidden\b/);
	});
});
