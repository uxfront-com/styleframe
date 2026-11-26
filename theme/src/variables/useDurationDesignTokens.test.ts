import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { durationValues } from "../values";
import { useDurationDesignTokens } from "./useDurationDesignTokens";

describe("useDurationDesignTokens", () => {
	it("should create a single duration variable with 'default' key", () => {
		const s = styleframe();
		const { duration } = useDurationDesignTokens(s, {
			default: "250ms",
		});

		expect(duration).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "duration",
			value: "250ms",
		});

		const css = consumeCSS(duration, s.options);
		expect(css).toBe(`--duration: 250ms;`);
	});

	it("should create duration variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { durationFast } = useDurationDesignTokens(s, {
			fast: "150ms",
		});

		expect(durationFast).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "duration.fast",
			value: "150ms",
		});

		const css = consumeCSS(durationFast, s.options);
		expect(css).toBe(`--duration--fast: 150ms;`);
	});

	it("should create multiple duration variables", () => {
		const s = styleframe();
		const { duration, durationFast, durationNormal, durationSlow } = useDurationDesignTokens(s, {
			default: "@duration.normal",
			fast: "150ms",
			normal: "250ms",
			slow: "300ms",
		});

		expect(durationFast).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "duration.fast",
			value: "150ms",
		});

		expect(durationNormal).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "duration.normal",
			value: "250ms",
		});

		expect(durationSlow).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "duration.slow",
			value: "300ms",
		});

		expect(duration).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "duration",
			value: {
				type: "reference",
				name: "duration.normal",
			},
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useDurationDesignTokens(s, {
			default: "250ms",
			fast: "150ms",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("duration");
		expect(s.root.variables[1]?.name).toBe("duration.fast");
	});

	it("should handle duration references", () => {
		const s = styleframe();
		const baseDuration = s.variable("base-duration", "200ms");
		const { duration } = useDurationDesignTokens(s, {
			default: s.ref(baseDuration),
		});

		expect(duration.value).toEqual({
			type: "reference",
			name: "base-duration",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useDurationDesignTokens(s, {
			default: "@duration.normal",
			fast: "150ms",
			normal: "250ms",
			slow: "300ms",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--duration--fast: 150ms;
	--duration--normal: 250ms;
	--duration--slow: 300ms;
	--duration: var(--duration--normal);
}`);
	});

	it("should use default values when called without arguments", () => {
		const s = styleframe();
		const durations = useDurationDesignTokens(s);

		expect(durations.durationInstant.value).toBe("0ms");
		expect(durations.durationFastest.value).toBe("50ms");
		expect(durations.durationFaster.value).toBe("100ms");
		expect(durations.durationFast.value).toBe("150ms");
		expect(durations.durationNormal.value).toBe("250ms");
		expect(durations.durationSlow.value).toBe("300ms");
		expect(durations.durationSlower.value).toBe("500ms");
		expect(durations.durationSlowest.value).toBe("1000ms");
	});

	it("should export durationValues with all expected keys", () => {
		expect(durationValues.instant).toBe("0ms");
		expect(durationValues.fastest).toBe("50ms");
		expect(durationValues.faster).toBe("100ms");
		expect(durationValues.fast).toBe("150ms");
		expect(durationValues.normal).toBe("250ms");
		expect(durationValues.slow).toBe("300ms");
		expect(durationValues.slower).toBe("500ms");
		expect(durationValues.slowest).toBe("1000ms");
	});

	it("should handle empty duration object", () => {
		const s = styleframe();
		const result = useDurationDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	describe("type safety", () => {
		it("should preserve exact duration names in return type", () => {
			const s = styleframe();
			const durations = useDurationDesignTokens(s, {
				default: "250ms",
				fast: "150ms",
			});

			const defaultDuration: Variable<"duration"> = durations.duration;
			const fastDuration: Variable<"duration.fast"> = durations.durationFast;

			expect(defaultDuration.name).toBe("duration");
			expect(fastDuration.name).toBe("duration.fast");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const durationConfig = {
				default: "250ms",
				fast: "150ms",
				slow: "300ms",
			} as const;

			const durations = useDurationDesignTokens(s, durationConfig);

			expect(durations.duration.name).toBe("duration");
			expect(durations.durationFast.name).toBe("duration.fast");
			expect(durations.durationSlow.name).toBe("duration.slow");
		});
	});
});
