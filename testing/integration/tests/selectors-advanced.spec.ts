import { test, expect } from "@playwright/test";

test.describe("Advanced Selectors", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/#/selectors-advanced");
	});

	test("card has correct base styles from design tokens", async ({ page }) => {
		// Set narrow viewport so @media (min-width: 768px) does NOT apply
		await page.setViewportSize({ width: 600, height: 768 });

		const element = page.locator("#test-card");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				padding: computed.padding,
				borderRadius: computed.borderRadius,
			};
		});

		expect(styles.padding).toBe("16px");
		expect(styles.borderRadius).toBe("4px");
	});

	test("card-title has correct descendant selector styles", async ({ page }) => {
		const element = page.locator("#test-card-title");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				fontSize: computed.fontSize,
				fontWeight: computed.fontWeight,
			};
		});

		expect(styles.fontSize).toBe("20px");
		expect(styles.fontWeight).toBe("700");
	});

	test("inline @media query changes card padding at wide viewport", async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 768 });

		const element = page.locator("#test-card");
		const padding = await element.evaluate((el) => window.getComputedStyle(el).padding);

		expect(padding).toBe("32px");
	});
});
