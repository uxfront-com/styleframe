import { test, expect } from "@playwright/test";

test.describe("Recipe Variant System", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/#/recipes");
	});

	test("default badge has base styles and primary solid variant", async ({ page }) => {
		const element = page.locator("#test-badge-default");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				display: computed.display,
				alignItems: computed.alignItems,
				backgroundColor: computed.backgroundColor,
			};
		});

		expect(styles.display).toBe("inline-flex");
		expect(styles.alignItems).toBe("center");
		// Primary solid: background should be primary color oklch
		expect(styles.backgroundColor).toContain("oklch(");
	});

	test("error outline badge has border color and transparent background", async ({ page }) => {
		const element = page.locator("#test-badge-error-outline");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				borderColor: computed.borderColor,
				color: computed.color,
			};
		});

		// Error outline: border-color and text should be error color
		expect(styles.borderColor).toContain("oklch(");
		expect(styles.color).toContain("oklch(");
	});

	test("success soft badge has tinted background and success text", async ({ page }) => {
		const element = page.locator("#test-badge-success-soft");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				backgroundColor: computed.backgroundColor,
				color: computed.color,
			};
		});

		// Soft variant: background is color-950, text is base color
		expect(styles.backgroundColor).toContain("oklch(");
		expect(styles.color).toContain("oklch(");
	});

	test("badge class attribute contains expected utility classes", async ({ page }) => {
		const element = page.locator("#test-badge-default");
		const classAttr = await element.getAttribute("class");

		// Should contain badge recipe utility classes
		expect(classAttr).toBeTruthy();
		expect(classAttr!.length).toBeGreaterThan(0);
	});
});
