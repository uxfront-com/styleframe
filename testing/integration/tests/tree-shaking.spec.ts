import fs from "node:fs";
import path from "node:path";

import { test, expect } from "@playwright/test";

const projectDir = process.env.PROJECT_DIR || path.join(import.meta.dirname, "..", ".app");

function readBuildCSS(): string {
	const distDir = path.join(projectDir, "dist", "assets");
	const cssFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".css"));
	return cssFiles.map((f) => fs.readFileSync(path.join(distDir, f), "utf8")).join("\n");
}

function readBuildJS(): string {
	const distDir = path.join(projectDir, "dist", "assets");
	const jsFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".js"));
	return jsFiles.map((f) => fs.readFileSync(path.join(distDir, f), "utf8")).join("\n");
}

function readBuildDTS(): string {
	const dtsPath = path.join(projectDir, ".styleframe", "styleframe.d.ts");
	return fs.readFileSync(dtsPath, "utf8");
}

test.describe("Recipe tree-shaking", () => {
	test("used recipe (badge) utilities are present in CSS", () => {
		const css = readBuildCSS();

		expect(css).toContain("inline-flex");
	});

	test("unused recipe (alert) base utilities are absent from CSS", () => {
		const css = readBuildCSS();

		expect(css).not.toContain("padding: 42px");
		expect(css).not.toContain("border-width: 5px");
	});

	test("unused recipe (alert) variant utilities are absent from CSS", () => {
		const css = readBuildCSS();

		expect(css).not.toContain("margin-top: 777px");
		expect(css).not.toContain("margin-bottom: 888px");
	});

	test("used recipe renders correctly at runtime", async ({ page }) => {
		await page.goto("/#/tree-shaking");

		const element = page.locator("#test-treeshake-used");
		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				display: computed.display,
				alignItems: computed.alignItems,
			};
		});

		expect(styles.display).toBe("inline-flex");
		expect(styles.alignItems).toBe("center");
	});

	test("used recipe with explicit variants renders correctly at runtime", async ({ page }) => {
		await page.goto("/#/tree-shaking");

		const element = page.locator("#test-treeshake-variant");
		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				display: computed.display,
				backgroundColor: computed.backgroundColor,
			};
		});

		expect(styles.display).toBe("inline-flex");
		// Primary+solid compound variant applies the primary color background
		expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
		expect(styles.backgroundColor).toContain("oklch(");
	});

	test("unused recipe class names produce no styling at runtime", async ({ page }) => {
		await page.goto("/#/tree-shaking");

		const padding = await page.evaluate(() => {
			const el = document.createElement("div");
			el.className = "alert _padding:[42px]";
			document.body.append(el);
			const computed = window.getComputedStyle(el);
			const value = computed.padding;
			document.body.removeChild(el);
			return value;
		});

		expect(padding).toBe("0px");
	});

	test("unused recipe is absent from JS consumer module", () => {
		const js = readBuildJS();

		expect(js).not.toContain("alertRecipe");
		expect(js).toContain("badgeRecipe");
	});

	test("unused recipe is absent from DTS", () => {
		const dts = readBuildDTS();

		expect(dts).not.toContain("AlertProps");
		expect(dts).not.toContain("export const alert");
	});
});

test.describe("recipes.include option", () => {
	test("force-included recipe (tooltip) utilities are present in CSS", () => {
		const css = readBuildCSS();

		expect(css).toContain("padding: 99px");
		expect(css).toContain("border-width: 7px");
	});

	test("force-included recipe is present in JS consumer module", () => {
		const js = readBuildJS();

		expect(js).toContain("tooltipRecipe");
	});

	test("force-included recipe is present in DTS", () => {
		const dts = readBuildDTS();

		expect(dts).toContain("TooltipProps");
		expect(dts).toContain("export const tooltip");
	});
});

test.describe("Utility tree-shaking", () => {
	test("scanner-detected utilities are present in CSS", () => {
		const css = readBuildCSS();

		expect(css).toContain("margin");
	});
});

test.describe("Variable tree-shaking", () => {
	test("used variables are present in CSS", () => {
		const css = readBuildCSS();

		expect(css).toContain("--color--primary");
	});

	test("unused variables are absent from CSS", () => {
		const css = readBuildCSS();

		expect(css).not.toContain("--unused--treeshake-marker");
		expect(css).not.toContain("999px");
	});
});

test.describe("Edge cases", () => {
	test("shared utilities between used and unused recipes are preserved", async ({ page }) => {
		await page.goto("/#/recipes");

		const element = page.locator("#test-badge-default");
		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				display: computed.display,
				backgroundColor: computed.backgroundColor,
			};
		});

		expect(styles.display).toBe("inline-flex");
		expect(styles.backgroundColor).toContain("oklch(");
	});
});
