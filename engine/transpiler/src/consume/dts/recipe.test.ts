import type { Root, StyleframeOptions } from "@styleframe/core";
import { createRecipeFunction, createRoot, createUtilityFunction } from "@styleframe/core";

import { createRecipeConsumer } from "./recipe";

describe("createRecipeConsumer (dts)", () => {
	const mockConsume = vi.fn();
	const consumeRecipe = createRecipeConsumer(mockConsume);
	const options: StyleframeOptions = {};

	let root: Root;
	let recipe: ReturnType<typeof createRecipeFunction>;
	let utility: ReturnType<typeof createUtilityFunction>;

	beforeEach(() => {
		mockConsume.mockClear();
		root = createRoot();
		recipe = createRecipeFunction(root, root);
		utility = createUtilityFunction(root, root);
	});

	it("should include boolean in type union when variant has both true and false keys", () => {
		utility("opacity", ({ value }) => ({ opacity: value }));

		const instance = recipe({
			name: "button",
			base: {},
			variants: {
				disabled: {
					true: { opacity: "50%" },
					false: { opacity: "100%" },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain('export type ButtonProps = { disabled?: "true" | "false" | boolean }');
		expect(result).toContain("export const button: (props?: ButtonProps) => string;");
	});

	it("should not include boolean when variant has only true key", () => {
		utility("borderRadius", ({ value }) => ({ borderRadius: value }));

		const instance = recipe({
			name: "button",
			base: {},
			variants: {
				rounded: {
					true: { borderRadius: "full" },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain('rounded?: "true"');
		expect(result).not.toContain("boolean");
		expect(result).toContain("(props?: ButtonProps) => string;");
	});

	it("should not include boolean for normal string variants", () => {
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "button",
			base: {},
			variants: {
				size: {
					sm: { padding: "1rem" },
					md: { padding: "2rem" },
					lg: { padding: "3rem" },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain('export type ButtonProps = { size?: "sm" | "md" | "lg" }');
		expect(result).toContain("(props?: ButtonProps) => string;");
		expect(result).not.toContain("boolean");
	});

	it("should handle mix of boolean and string variants", () => {
		utility("opacity", ({ value }) => ({ opacity: value }));
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "button",
			base: {},
			variants: {
				disabled: {
					true: { opacity: "50%" },
					false: { opacity: "100%" },
				},
				size: {
					sm: { padding: "1rem" },
					md: { padding: "2rem" },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain('disabled?: "true" | "false" | boolean');
		expect(result).toContain('size?: "sm" | "md"');
		expect(result).toContain("(props?: ButtonProps) => string;");
	});

	it("should generate PascalCase props type name from export name", () => {
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "card-header",
			base: {},
			variants: {
				size: {
					sm: { padding: "1rem" },
				},
			},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain("export type CardHeaderProps =");
		expect(result).toContain("(props?: CardHeaderProps) => string;");
	});

	it("should handle PascalCase export names", () => {
		const instance = recipe({
			name: "PrimaryButton",
			base: {},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain("export type PrimaryButtonProps =");
		expect(result).toContain("(props?: PrimaryButtonProps) => string;");
	});

	it("should generate props type from _exportName when set", () => {
		utility("padding", ({ value }) => ({ padding: value }));

		const instance = recipe({
			name: "my-tab",
			base: {},
			variants: {
				state: {
					active: { padding: "1rem" },
					inactive: { padding: "0.5rem" },
				},
			},
		});
		instance._exportName = "pgTab";

		const result = consumeRecipe(instance, options);

		expect(result).toContain("export type PgTabProps =");
		expect(result).toContain("export const pgTab: (props?: PgTabProps) => string;");
	});

	it("should generate empty props type for recipes without variants", () => {
		const instance = recipe({
			name: "divider",
			base: {},
			variants: {},
		});

		const result = consumeRecipe(instance, options);

		expect(result).toContain("export type DividerProps = Record<string, never>;");
		expect(result).toContain("(props?: DividerProps) => string;");
	});
});
