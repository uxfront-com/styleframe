import { describe, expect, it } from "vitest";

import { isFigmaVariableType } from "./shared";

describe("isFigmaVariableType", () => {
	it.each(["COLOR", "FLOAT", "STRING", "BOOLEAN"])("accepts %s", (type) => {
		expect(isFigmaVariableType(type)).toBe(true);
	});

	it.each(["EASING", "TIMING", "", "color"])("rejects %j", (type) => {
		expect(isFigmaVariableType(type)).toBe(false);
	});
});
