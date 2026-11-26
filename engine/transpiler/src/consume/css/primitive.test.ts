import type { StyleframeOptions } from "@styleframe/core";
import { createPrimitiveConsumer } from "./primitive";
import { consume } from "./consume";

describe("createPrimitiveConsumer", () => {
	const consumePrimitive = createPrimitiveConsumer(consume);
	const options: StyleframeOptions = {};

	it("should return a string representation of a number", () => {
		expect(consumePrimitive(42, options)).toBe("42");
	});

	it("should return a string representation of a string", () => {
		expect(consumePrimitive("test", options)).toBe("test");
	});

	it("should return a string representation of a boolean", () => {
		expect(consumePrimitive(true, options)).toBe("true");
		expect(consumePrimitive(false, options)).toBe("false");
	});

	it("should return a string representation of zero", () => {
		expect(consumePrimitive(0, options)).toBe("0");
	});

	it("should return a string representation of an empty string", () => {
		expect(consumePrimitive("", options)).toBe("");
	});

	it("should return an empty string for null", () => {
		expect(consumePrimitive(null, options)).toBe("");
	});

	it("should return an empty string for undefined", () => {
		expect(consumePrimitive(undefined, options)).toBe("");
	});

	it("should convert objects to string representation", () => {
		const obj = { a: 1, b: 2 };
		expect(consumePrimitive(obj, options)).toBe("[object Object]");
	});

	it("should convert arrays to string representation", () => {
		const arr = [1, 2, 3];
		expect(consumePrimitive(arr, options)).toBe("1,2,3");
	});

	it("should handle special values like NaN and Infinity", () => {
		expect(consumePrimitive(Number.NaN, options)).toBe("NaN");
		expect(consumePrimitive(Infinity, options)).toBe("Infinity");
	});
});
