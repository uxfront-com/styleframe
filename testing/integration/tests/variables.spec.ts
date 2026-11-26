import { test, expect } from "@playwright/test";

test.describe("CSS Custom Properties and Refs", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/#/variables");
	});

	test("custom variables applied via ref()", async ({ page }) => {
		const element = page.locator("#test-custom-vars");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				width: computed.width,
				fontFamily: computed.fontFamily,
			};
		});

		expect(styles.width).toBe("48px");
		expect(styles.fontFamily).toContain("monospace");
	});

	test("@-prefix string refs resolve to correct values", async ({ page }) => {
		const element = page.locator("#test-ref-string");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				padding: computed.padding,
				fontSize: computed.fontSize,
			};
		});

		expect(styles.padding).toBe("24px");
		expect(styles.fontSize).toBe("20px");
	});

	test("CSS custom property exists on :root", async ({ page }) => {
		const value = await page.evaluate(() =>
			window.getComputedStyle(document.documentElement).getPropertyValue("--custom--size"),
		);

		expect(value.trim()).toBe("48px");
	});
});
