import { test, expect } from "@playwright/test";

test.describe("Borders and Effects", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/#/borders-effects");
	});

	test("border-radius lg resolves to correct value", async ({ page }) => {
		const element = page.locator("#test-border-radius-lg");
		const borderRadius = await element.evaluate((el) => window.getComputedStyle(el).borderRadius);

		expect(borderRadius).toBe("8px");
	});

	test("border-radius full resolves to 9999px", async ({ page }) => {
		const element = page.locator("#test-border-radius-full");
		const borderRadius = await element.evaluate((el) => window.getComputedStyle(el).borderRadius);

		expect(borderRadius).toBe("9999px");
	});

	test("display hidden applies display none", async ({ page }) => {
		const element = page.locator("#test-display-hidden");
		const display = await element.evaluate((el) => window.getComputedStyle(el).display);

		expect(display).toBe("none");
	});
});
