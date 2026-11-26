import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useZIndexDesignTokens } from "./useZIndexDesignTokens";

describe("useZIndexDesignTokens", () => {
	it("should create a single z-index variable with 'default' key", () => {
		const s = styleframe();
		const { zIndex } = useZIndexDesignTokens(s, {
			default: "0",
		});

		expect(zIndex).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index",
			value: "0",
		});

		const css = consumeCSS(zIndex, s.options);
		expect(css).toBe(`--z-index: 0;`);
	});

	it("should create z-index variable with modifier for non-default keys", () => {
		const s = styleframe();
		const { zIndexModal } = useZIndexDesignTokens(s, {
			modal: "400",
		});

		expect(zIndexModal).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index.modal",
			value: "400",
		});

		const css = consumeCSS(zIndexModal, s.options);
		expect(css).toBe(`--z-index--modal: 400;`);
	});

	it("should create multiple z-index variables", () => {
		const s = styleframe();
		const { zIndex, zIndexDropdown, zIndexModal, zIndexToast } = useZIndexDesignTokens(s, {
			default: "0",
			dropdown: "100",
			modal: "400",
			toast: "600",
		});

		expect(zIndex).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index",
			value: "0",
		});

		expect(zIndexDropdown).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index.dropdown",
			value: "100",
		});

		expect(zIndexModal).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index.modal",
			value: "400",
		});

		expect(zIndexToast).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index.toast",
			value: "600",
		});
	});

	it("should add variables to root", () => {
		const s = styleframe();
		useZIndexDesignTokens(s, {
			default: "0",
			modal: "400",
		});

		expect(s.root.variables).toHaveLength(2);
		expect(s.root.variables[0]?.name).toBe("z-index");
		expect(s.root.variables[1]?.name).toBe("z-index.modal");
	});

	it("should handle negative z-index values", () => {
		const s = styleframe();
		const { zIndexHide } = useZIndexDesignTokens(s, {
			hide: "-1",
		});

		expect(zIndexHide).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index.hide",
			value: "-1",
		});
	});

	it("should handle auto value", () => {
		const s = styleframe();
		const { zIndexAuto } = useZIndexDesignTokens(s, {
			auto: "auto",
		});

		expect(zIndexAuto).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index.auto",
			value: "auto",
		});
	});

	it("should handle numeric z-index names", () => {
		const s = styleframe();
		const { zIndex100 } = useZIndexDesignTokens(s, {
			"100": "100",
		});

		expect(zIndex100).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "z-index.100",
			value: "100",
		});
	});

	it("should handle empty z-index object", () => {
		const s = styleframe();
		const result = useZIndexDesignTokens(s, {});

		expect(result).toEqual({});
		expect(s.root.variables).toHaveLength(0);
	});

	it("should handle z-index references", () => {
		const s = styleframe();
		const baseZIndex = s.variable("base-z-index", "100");
		const { zIndex } = useZIndexDesignTokens(s, {
			default: s.ref(baseZIndex),
		});

		expect(zIndex.value).toEqual({
			type: "reference",
			name: "base-z-index",
		});
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useZIndexDesignTokens(s, {
			default: "0",
			hide: "-1",
			dropdown: "100",
			modal: "400",
			toast: "600",
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--z-index: 0;
	--z-index--hide: -1;
	--z-index--dropdown: 100;
	--z-index--modal: 400;
	--z-index--toast: 600;
}`);
	});

	it("should handle a complete z-index scale", () => {
		const s = styleframe();
		const zIndexVars = useZIndexDesignTokens(s, {
			hide: "-1",
			base: "0",
			dropdown: "100",
			sticky: "200",
			overlay: "300",
			modal: "400",
			popover: "500",
			toast: "600",
			max: "9999",
			auto: "auto",
		});

		expect(zIndexVars.zIndexHide.value).toBe("-1");
		expect(zIndexVars.zIndexBase.value).toBe("0");
		expect(zIndexVars.zIndexDropdown.value).toBe("100");
		expect(zIndexVars.zIndexSticky.value).toBe("200");
		expect(zIndexVars.zIndexOverlay.value).toBe("300");
		expect(zIndexVars.zIndexModal.value).toBe("400");
		expect(zIndexVars.zIndexPopover.value).toBe("500");
		expect(zIndexVars.zIndexToast.value).toBe("600");
		expect(zIndexVars.zIndexMax.value).toBe("9999");
		expect(zIndexVars.zIndexAuto.value).toBe("auto");
	});

	describe("type safety", () => {
		it("should preserve exact z-index names in return type", () => {
			const s = styleframe();
			const zIndexVars = useZIndexDesignTokens(s, {
				default: "0",
				modal: "400",
			});

			const defaultZIndex: Variable<"z-index"> = zIndexVars.zIndex;
			const modalZIndex: Variable<"z-index.modal"> = zIndexVars.zIndexModal;

			expect(defaultZIndex.name).toBe("z-index");
			expect(modalZIndex.name).toBe("z-index.modal");
		});

		it("should maintain type information for kebab-case names", () => {
			const s = styleframe();
			const { zIndexExtraHigh } = useZIndexDesignTokens(s, {
				"extra-high": "9000",
			});

			const typed: Variable<"z-index.extra-high"> = zIndexExtraHigh;
			expect(typed.name).toBe("z-index.extra-high");
		});

		it("should work with const assertion", () => {
			const s = styleframe();
			const zIndexConfig = {
				default: "0",
				modal: "400",
			} as const;

			const zIndexVars = useZIndexDesignTokens(s, zIndexConfig);

			expect(zIndexVars.zIndex.name).toBe("z-index");
			expect(zIndexVars.zIndexModal.name).toBe("z-index.modal");
		});
	});
});
