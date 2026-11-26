import { styleframe } from "styleframe";
import { describe, expect, it } from "vitest";

import { scanAndRegisterUtilities } from "@/pipeline/scanAndRegisterUtilities";

describe("scanAndRegisterUtilities", () => {
	it("registers a utility value referenced by class name in a Vue template", () => {
		const s = styleframe();
		const { utility } = s;

		utility("margin", ({ value }) => ({ margin: value }));

		const factory = s.root.utilities.find((u) => u.name === "margin")!;

		const appVue = `
			<template>
				<p class="_margin:0">hello</p>
			</template>
		`;

		const result = scanAndRegisterUtilities(s, [{ content: appVue, filePath: "App.vue" }]);

		expect(result.count).toBe(1);
		expect(result.registered).toEqual(["_margin:0"]);
		expect(factory.values.some((v) => v.key === "0")).toBe(true);
	});

	it("scans multiple sources and deduplicates matches", () => {
		const s = styleframe();
		const { utility } = s;

		utility("padding", ({ value }) => ({ padding: value }));

		const appVue = `<template><p class="_padding:sm" /></template>`;
		const componentVue = `<template><p class="_padding:sm" /></template>`;

		const result = scanAndRegisterUtilities(s, [
			{ content: appVue, filePath: "App.vue" },
			{ content: componentVue, filePath: "Component.vue" },
		]);

		expect(result.count).toBe(1);
		expect(result.registered).toEqual(["_padding:sm"]);
	});

	it("returns zero registrations when no utility classes are present", () => {
		const s = styleframe();
		const { utility } = s;
		utility("margin", ({ value }) => ({ margin: value }));

		const result = scanAndRegisterUtilities(s, [
			{
				content: "<template><p>no classes</p></template>",
				filePath: "App.vue",
			},
		]);

		expect(result.count).toBe(0);
		expect(result.registered).toEqual([]);
		expect(result.diagnostics).toEqual([]);
	});

	it("registers arbitrary values with literal CSS", () => {
		const s = styleframe();
		const { utility } = s;

		utility("margin", ({ value }) => ({ margin: value }));
		const factory = s.root.utilities.find((u) => u.name === "margin")!;

		const appVue = `<template><p class="_margin:[16px]" /></template>`;

		const result = scanAndRegisterUtilities(s, [{ content: appVue, filePath: "App.vue" }]);

		expect(result.count).toBe(1);
		expect(result.registered).toEqual(["_margin:[16px]"]);
		expect(factory.values.some((v) => v.key === "[16px]")).toBe(true);
	});

	it("reports diagnostics for classes whose factory is missing", () => {
		const s = styleframe();

		const appVue = `<template><p class="_unknown-prop:sm" /></template>`;

		const result = scanAndRegisterUtilities(s, [{ content: appVue, filePath: "App.vue" }]);

		expect(result.count).toBe(0);
		expect(result.registered).toEqual([]);
		expect(result.diagnostics).toEqual([
			{
				raw: "_unknown-prop:sm",
				name: "unknown-prop",
				value: "sm",
				modifiers: [],
				factoryFound: false,
				alreadyExisted: false,
			},
		]);
	});
});
