import { describe, expect, it } from "vitest";

import { isValidNamespace } from "../../src/extensions/namespace";

describe("isValidNamespace", () => {
	it("accepts reverse-DNS namespaces", () => {
		expect(isValidNamespace("com.example.tool")).toBe(true);
		expect(isValidNamespace("dev.styleframe")).toBe(true);
		expect(isValidNamespace("org.tokens-studio.figma")).toBe(true);
	});

	it("rejects single-segment names", () => {
		expect(isValidNamespace("styleframe")).toBe(false);
		expect(isValidNamespace("")).toBe(false);
	});

	it("rejects names with invalid characters", () => {
		expect(isValidNamespace("com.example.tool@v1")).toBe(false);
		expect(isValidNamespace("com..example")).toBe(false);
		expect(isValidNamespace(".com.example")).toBe(false);
	});
});
