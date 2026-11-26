import { test, expect } from "@playwright/test";

test.describe("Theme Switching", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/#/themes");
	});

	test("default theme applies correct colors", async ({ page }) => {
		const element = page.locator("#test-theme-default");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				backgroundColor: computed.backgroundColor,
				color: computed.color,
			};
		});

		// Default primary (#3b82f6) and secondary (#6b7280)
		expect(styles.backgroundColor).toContain("oklch(");
		expect(styles.color).toContain("oklch(");
	});

	test("dark theme overrides variable values", async ({ page }) => {
		const defaultElement = page.locator("#test-theme-default");
		const darkElement = page.locator("#test-theme-dark");

		const defaultBg = await defaultElement.evaluate(
			(el) => window.getComputedStyle(el).backgroundColor,
		);

		const darkBg = await darkElement.evaluate((el) => window.getComputedStyle(el).backgroundColor);

		// Default and dark should have different background colors
		expect(defaultBg).not.toBe(darkBg);

		// Default uses oklch, dark uses hex (#60a5fa) which browsers resolve to rgb
		expect(defaultBg).toContain("oklch(");
		expect(darkBg).toBe("rgb(96, 165, 250)");
	});

	test("dark theme color values cascade through data-theme attribute", async ({ page }) => {
		const darkElement = page.locator("#test-theme-dark");

		const styles = await darkElement.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				backgroundColor: computed.backgroundColor,
				color: computed.color,
			};
		});

		// Dark primary (#60a5fa) → rgb(96, 165, 250), dark secondary (#9ca3af) → rgb(156, 163, 175)
		expect(styles.backgroundColor).toBe("rgb(96, 165, 250)");
		expect(styles.color).toBe("rgb(156, 163, 175)");
	});
});
