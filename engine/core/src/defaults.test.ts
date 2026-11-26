import { describe, it, expect } from "vitest";

import { defaultUtilitySelectorFn, transformUtilityKey } from "./defaults";
import type { Reference } from "./types";
import { hashValue } from "./utils/hash";

describe("transformUtilityKey", () => {
	describe("with default replacer", () => {
		it("should transform a string starting with @ into a reference", () => {
			const transform = transformUtilityKey();
			const result = transform("@color");

			expect(result).toEqual({
				color: {
					type: "reference",
					name: "color",
				},
			});
		});

		it("should use the variable name as the key for @ strings", () => {
			const transform = transformUtilityKey();
			const result = transform("@spacing-md");

			expect(result).toEqual({
				"spacing-md": {
					type: "reference",
					name: "spacing-md",
				},
			});
		});

		it("should use the reference name as the key for Reference objects", () => {
			const transform = transformUtilityKey();
			const ref: Reference = { type: "reference", name: "primary" };
			const result = transform(ref);

			expect(result).toEqual({
				primary: ref,
			});
		});

		it("should wrap non-reference values in brackets", () => {
			const transform = transformUtilityKey();
			const result = transform("red");

			expect(result).toEqual({
				"[red]": "red",
			});
		});

		it("should wrap numeric values in brackets", () => {
			const transform = transformUtilityKey();
			const result = transform(42);

			expect(result).toEqual({
				"[42]": 42,
			});
		});

		it("should wrap null values in brackets", () => {
			const transform = transformUtilityKey();
			const result = transform(null);

			expect(result).toEqual({
				"[null]": null,
			});
		});

		it("should wrap boolean values in brackets", () => {
			const transform = transformUtilityKey();
			const result = transform(true);

			expect(result).toEqual({
				"[true]": true,
			});
		});
	});

	describe("with custom replacer", () => {
		it("should apply custom replacer to @ string variable names", () => {
			const transform = transformUtilityKey((key) => `prefix-${key}`);
			const result = transform("@color");

			expect(result).toEqual({
				"prefix-color": {
					type: "reference",
					name: "color",
				},
			});
		});

		it("should apply custom replacer to Reference object names", () => {
			const transform = transformUtilityKey((key) => key.toUpperCase());
			const ref: Reference = { type: "reference", name: "primary" };
			const result = transform(ref);

			expect(result).toEqual({
				PRIMARY: ref,
			});
		});

		it("should not apply replacer to non-reference values", () => {
			const replacer = (key: string) => `modified-${key}`;
			const transform = transformUtilityKey(replacer);
			const result = transform("red");

			expect(result).toEqual({
				"[red]": "red",
			});
		});

		it("should handle complex key transformations", () => {
			const transform = transformUtilityKey((key) => key.replaceAll("-", "_").toLowerCase());
			const result = transform("@Some-Variable-Name");

			expect(result).toEqual({
				some_variable_name: {
					type: "reference",
					name: "Some-Variable-Name",
				},
			});
		});
	});

	describe("with namespace option", () => {
		it("should prepend namespace to reference name for @ strings", () => {
			const transform = transformUtilityKey({ namespace: "spacing" });
			const result = transform("@sm");

			expect(result).toEqual({
				sm: {
					type: "reference",
					name: "spacing.sm",
				},
			});
		});

		it("should strip namespace prefix from key and preserve ref for Reference objects", () => {
			const transform = transformUtilityKey({ namespace: "spacing" });
			const ref: Reference = { type: "reference", name: "spacing.md" };
			const result = transform(ref);

			expect(result).toEqual({
				md: ref,
			});
		});

		it("should pass through Reference objects without namespace prefix unchanged", () => {
			const transform = transformUtilityKey({ namespace: "color" });
			const ref: Reference = { type: "reference", name: "primary" };
			const result = transform(ref);

			expect(result).toEqual({
				primary: ref,
			});
		});

		it("should not affect non-reference values", () => {
			const transform = transformUtilityKey({ namespace: "spacing" });
			const result = transform("auto");

			expect(result).toEqual({
				"[auto]": "auto",
			});
		});

		it("should work with both namespace and replacer", () => {
			const transform = transformUtilityKey({
				namespace: "color",
				replacer: (key) => key.toUpperCase(),
			});
			const result = transform("@primary");

			expect(result).toEqual({
				PRIMARY: {
					type: "reference",
					name: "color.primary",
				},
			});
		});

		it("should preserve backward compatibility with function argument", () => {
			const transform = transformUtilityKey((key) => `custom-${key}`);
			const result = transform("@sm");

			expect(result).toEqual({
				"custom-sm": {
					type: "reference",
					name: "sm",
				},
			});
		});

		it("should strip namespace prefix from key and preserve fallback for Reference objects", () => {
			const transform = transformUtilityKey({ namespace: "color" });
			const ref: Reference = {
				type: "reference",
				name: "color.primary",
				fallback: "blue",
			};
			const result = transform(ref);

			expect(result).toEqual({
				primary: ref,
			});
		});

		it("should work with both namespace and replacer for Reference objects", () => {
			const transform = transformUtilityKey({
				namespace: "spacing",
				replacer: (key) => key.toUpperCase(),
			});
			const ref: Reference = { type: "reference", name: "spacing.md" };
			const result = transform(ref);

			expect(result).toEqual({
				MD: ref,
			});
		});
	});

	describe("with namespace array option", () => {
		it("should use first namespace for @ string references", () => {
			const transform = transformUtilityKey({
				namespace: ["border-color", "color"],
			});
			const result = transform("@primary");

			expect(result).toEqual({
				primary: {
					type: "reference",
					name: "border-color.primary",
				},
			});
		});

		it("should strip first matching namespace prefix from Reference objects", () => {
			const transform = transformUtilityKey({
				namespace: ["border-color", "color"],
			});
			const ref: Reference = {
				type: "reference",
				name: "border-color.primary",
			};
			const result = transform(ref);

			expect(result).toEqual({
				primary: ref,
			});
		});

		it("should strip second namespace prefix when first does not match", () => {
			const transform = transformUtilityKey({
				namespace: ["border-color", "color"],
			});
			const ref: Reference = {
				type: "reference",
				name: "color.primary",
			};
			const result = transform(ref);

			expect(result).toEqual({
				primary: ref,
			});
		});

		it("should pass through Reference without matching namespace prefix unchanged", () => {
			const transform = transformUtilityKey({
				namespace: ["border-color", "color"],
			});
			const ref: Reference = {
				type: "reference",
				name: "spacing.sm",
			};
			const result = transform(ref);

			expect(result).toEqual({
				"spacing.sm": ref,
			});
		});

		it("should work with single-element array (backward compat)", () => {
			const transform = transformUtilityKey({
				namespace: ["spacing"],
			});
			const result = transform("@sm");

			expect(result).toEqual({
				sm: {
					type: "reference",
					name: "spacing.sm",
				},
			});
		});

		it("should work with both namespace array and replacer", () => {
			const transform = transformUtilityKey({
				namespace: ["border-color", "color"],
				replacer: (key) => key.toUpperCase(),
			});
			const result = transform("@primary");

			expect(result).toEqual({
				PRIMARY: {
					type: "reference",
					name: "border-color.primary",
				},
			});
		});
	});

	describe("with namespace-prefixed @ values (recipe scenario)", () => {
		it("should not double-prepend namespace when @ value already includes it", () => {
			const transform = transformUtilityKey({ namespace: "color" });
			const result = transform("@color.light");

			expect(result).toEqual({
				light: {
					type: "reference",
					name: "color.light",
				},
			});
		});

		it("should handle spacing namespace with dot-separated values", () => {
			const transform = transformUtilityKey({ namespace: "spacing" });
			const result = transform("@spacing.2xs");

			expect(result).toEqual({
				"2xs": {
					type: "reference",
					name: "spacing.2xs",
				},
			});
		});

		it("should handle border-radius namespace with dot-separated values", () => {
			const transform = transformUtilityKey({
				namespace: "border-radius",
			});
			const result = transform("@border-radius.sm");

			expect(result).toEqual({
				sm: {
					type: "reference",
					name: "border-radius.sm",
				},
			});
		});

		it("should still prepend namespace for non-prefixed @ values", () => {
			const transform = transformUtilityKey({ namespace: "color" });
			const result = transform("@primary");

			expect(result).toEqual({
				primary: {
					type: "reference",
					name: "color.primary",
				},
			});
		});

		it("should handle namespace array with already-prefixed @ values", () => {
			const transform = transformUtilityKey({
				namespace: ["border-color", "color"],
			});
			const result = transform("@color.primary");

			expect(result).toEqual({
				primary: {
					type: "reference",
					name: "color.primary",
				},
			});
		});

		it("should handle font-weight namespace with dot-separated values", () => {
			const transform = transformUtilityKey({
				namespace: "font-weight",
			});
			const result = transform("@font-weight.medium");

			expect(result).toEqual({
				medium: {
					type: "reference",
					name: "font-weight.medium",
				},
			});
		});
	});

	describe("edge cases", () => {
		it("should handle @ string with empty variable name", () => {
			const transform = transformUtilityKey();
			const result = transform("@");

			expect(result).toEqual({
				"": {
					type: "reference",
					name: "",
				},
			});
		});

		it("should handle Reference with fallback", () => {
			const transform = transformUtilityKey();
			const ref: Reference = {
				type: "reference",
				name: "color",
				fallback: "blue",
			};
			const result = transform(ref);

			expect(result).toEqual({
				color: ref,
			});
		});

		it("should preserve the original Reference object", () => {
			const transform = transformUtilityKey();
			const ref: Reference = { type: "reference", name: "test" };
			const result = transform(ref);

			expect(result.test).toBe(ref);
		});

		it("should handle strings that look like @ but are not at the start", () => {
			const transform = transformUtilityKey();
			const result = transform("email@example.com");

			expect(result).toEqual({
				"[email@example.com]": "email@example.com",
			});
		});

		it("should handle empty string", () => {
			const transform = transformUtilityKey();
			const result = transform("");

			expect(result).toEqual({
				"[]": "",
			});
		});
	});

	describe("whitespace arbitrary values", () => {
		it("should hash string values containing spaces", () => {
			const transform = transformUtilityKey();
			const result = transform("all 0.3s ease");
			const keys = Object.keys(result);

			expect(keys[0]).toMatch(/^[0-9a-f]{7}$/);
			expect(keys[0]).not.toContain("[");
			expect(keys[0]).not.toContain(" ");
			expect(result[keys[0]!]).toBe("all 0.3s ease");
		});

		it("should produce deterministic hashes", () => {
			const transform = transformUtilityKey();
			const result1 = transform("all 0.3s ease");
			const result2 = transform("all 0.3s ease");
			expect(Object.keys(result1)[0]).toBe(Object.keys(result2)[0]);
		});

		it("should produce the expected hash key for a known value", () => {
			const transform = transformUtilityKey();
			const result = transform("all 0.3s ease");
			const expectedHash = hashValue("all 0.3s ease");
			expect(result).toEqual({
				[expectedHash]: "all 0.3s ease",
			});
		});

		it("should NOT hash values without whitespace (backward compatible)", () => {
			const transform = transformUtilityKey();
			expect(transform("red")).toEqual({ "[red]": "red" });
			expect(transform("1rem")).toEqual({ "[1rem]": "1rem" });
			expect(transform("#1E3A8A")).toEqual({ "[#1E3A8A]": "#1E3A8A" });
		});

		it("should NOT hash numeric or boolean values", () => {
			const transform = transformUtilityKey();
			expect(transform(42)).toEqual({ "[42]": 42 });
			expect(transform(true)).toEqual({ "[true]": true });
			expect(transform(null)).toEqual({ "[null]": null });
		});

		it("should hash values with tabs", () => {
			const transform = transformUtilityKey();
			const result = transform("a\tb");
			const keys = Object.keys(result);
			expect(keys[0]).toMatch(/^[0-9a-f]{7}$/);
		});

		it("should hash values with newlines", () => {
			const transform = transformUtilityKey();
			const result = transform("a\nb");
			const keys = Object.keys(result);
			expect(keys[0]).toMatch(/^[0-9a-f]{7}$/);
		});

		it("should produce different hashes for different whitespace values", () => {
			const transform = transformUtilityKey();
			const key1 = Object.keys(transform("all 0.3s ease"))[0];
			const key2 = Object.keys(transform("all 0.5s linear"))[0];
			expect(key1).not.toBe(key2);
		});

		it("should hash calc expressions with spaces", () => {
			const transform = transformUtilityKey();
			const result = transform("calc(100% - 20px)");
			const keys = Object.keys(result);
			expect(keys[0]).toMatch(/^[0-9a-f]{7}$/);
			expect(result[keys[0]!]).toBe("calc(100% - 20px)");
		});

		it("should hash multi-value CSS shorthand properties", () => {
			const transform = transformUtilityKey();
			const result = transform("1px solid red");
			const keys = Object.keys(result);
			expect(keys[0]).toMatch(/^[0-9a-f]{7}$/);
			expect(result[keys[0]!]).toBe("1px solid red");
		});
	});
});

describe("defaultUtilitySelectorFn", () => {
	it("should generate a selector with name and value", () => {
		const result = defaultUtilitySelectorFn({
			name: "color",
			value: "primary",
			modifiers: [],
		});

		expect(result).toBe("_color:primary");
	});

	it("should omit value when it is 'default'", () => {
		const result = defaultUtilitySelectorFn({
			name: "display",
			value: "default",
			modifiers: [],
		});

		expect(result).toBe("_display");
	});

	it("should prepend modifiers before name", () => {
		const result = defaultUtilitySelectorFn({
			name: "color",
			value: "primary",
			modifiers: ["hover", "sm"],
		});

		expect(result).toBe("_hover:sm:color:primary");
	});

	it("should handle modifiers with default value", () => {
		const result = defaultUtilitySelectorFn({
			name: "flex",
			value: "default",
			modifiers: ["md"],
		});

		expect(result).toBe("_md:flex");
	});

	it("should handle empty name gracefully", () => {
		const result = defaultUtilitySelectorFn({
			name: "",
			value: "value",
			modifiers: [],
		});

		expect(result).toBe("_value");
	});

	it("should filter out falsy parts", () => {
		const result = defaultUtilitySelectorFn({
			name: "color",
			value: "",
			modifiers: [],
		});

		expect(result).toBe("_color");
	});
});
