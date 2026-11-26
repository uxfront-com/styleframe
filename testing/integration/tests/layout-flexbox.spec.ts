import { test, expect } from "@playwright/test";

test.describe("Layout and Flexbox Utilities", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/#/layout-flexbox");
	});

	test("flex container has all flexbox properties applied", async ({ page }) => {
		const element = page.locator("#test-flex-container");

		const styles = await element.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				display: computed.display,
				flexDirection: computed.flexDirection,
				alignItems: computed.alignItems,
				justifyContent: computed.justifyContent,
				gap: computed.gap,
			};
		});

		expect(styles.display).toBe("flex");
		expect(styles.flexDirection).toBe("column");
		expect(styles.alignItems).toBe("center");
		expect(styles.justifyContent).toBe("center");
		expect(styles.gap).toBe("16px");
	});

	test("position utilities apply correctly", async ({ page }) => {
		const relativeElement = page.locator("#test-position-relative");
		const absoluteElement = page.locator("#test-position-absolute");

		const relativePosition = await relativeElement.evaluate(
			(el) => window.getComputedStyle(el).position,
		);
		const absolutePosition = await absoluteElement.evaluate(
			(el) => window.getComputedStyle(el).position,
		);

		expect(relativePosition).toBe("relative");
		expect(absolutePosition).toBe("absolute");
	});

	test("overflow utility applies correctly", async ({ page }) => {
		const element = page.locator("#test-overflow");
		const overflow = await element.evaluate((el) => window.getComputedStyle(el).overflow);

		expect(overflow).toBe("hidden");
	});
});
