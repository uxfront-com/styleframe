import type { AtRule, Selector } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useDesignTokensPreset } from "../presets/useDesignTokensPreset";
import { defaultLinkOptions, useLinkElement } from "./useLinkElement";

function createInstance() {
	const s = styleframe();
	useDesignTokensPreset(s);
	return s;
}

describe("useLinkElement", () => {
	it("should create link variables and selector with hover", () => {
		const s = createInstance();
		const result = useLinkElement(s);

		expect(result.linkColor).toBeDefined();
		expect(result.linkTextDecoration).toBeDefined();
		expect(result.linkHoverColor).toBeDefined();
		expect(result.linkHoverTextDecoration).toBeDefined();

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("var(--link--color)");
		expect(css).toContain("var(--link--text-decoration)");
		expect(css).toContain("var(--link--hover--color)");
		expect(css).toContain("var(--link--hover--text-decoration)");
	});

	it("should apply the hover styles only inside @media (hover: hover)", () => {
		const s = createInstance();
		const result = useLinkElement(s);

		const link = s.root.children.find(
			(child) => child.type === "selector" && child.query === "a",
		) as Selector;
		expect(link.declarations).toEqual({
			color: s.ref(result.linkColor),
			textDecoration: s.ref(result.linkTextDecoration),
		});
		expect(link.children.map((child) => child.type)).toEqual(["at-rule"]);

		const media = link.children[0] as AtRule;
		expect(media.identifier).toBe("media");
		expect(media.rule).toBe("(hover: hover)");
		expect(media.declarations).toEqual({});
		expect(media.children).toHaveLength(1);

		const hover = media.children[0] as Selector;
		expect(hover.type).toBe("selector");
		expect(hover.query).toBe("&:hover");
		expect(hover.declarations).toEqual({
			color: s.ref(result.linkHoverColor),
			textDecoration: s.ref(result.linkHoverTextDecoration),
		});

		const css = consumeCSS(s.root, s.options);
		const hoverColor = css.indexOf("var(--link--hover--color)");
		expect(
			css.lastIndexOf("@media (hover: hover)", hoverColor),
		).toBeGreaterThan(css.indexOf("a {"));
	});

	it("should keep the link variables and their defaults", () => {
		const s = createInstance();
		const result = useLinkElement(s);

		expect(result.linkColor.name).toBe("link.color");
		expect(result.linkTextDecoration.name).toBe("link.text-decoration");
		expect(result.linkHoverColor.name).toBe("link.hover.color");
		expect(result.linkHoverTextDecoration.name).toBe(
			"link.hover.text-decoration",
		);
		expect(defaultLinkOptions).toEqual({
			color: "@color.primary",
			textDecoration: "none",
			hoverColor: "@color.primary-700",
			hoverTextDecoration: "underline",
		});
	});

	it("should use custom link values", () => {
		const s = createInstance();
		const result = useLinkElement(s, {
			color: "#0066cc",
			textDecoration: "underline",
			hoverColor: "#004499",
			hoverTextDecoration: "none",
		});

		expect(result.linkColor.value).toBe("#0066cc");
		expect(result.linkTextDecoration.value).toBe("underline");
		expect(result.linkHoverColor.value).toBe("#004499");
		expect(result.linkHoverTextDecoration.value).toBe("none");
	});
});
