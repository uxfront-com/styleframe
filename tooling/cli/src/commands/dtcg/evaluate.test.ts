import type { CSS, Reference, TokenValue, Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { useFluidClamp } from "@styleframe/theme";
import { describe, expect, it } from "vitest";
import { evaluateValue } from "./evaluate";

function v(name: string, value: TokenValue): Variable {
	return { type: "variable", id: name, name, value };
}

function ref(name: string, fallback?: TokenValue): Reference {
	return fallback === undefined
		? { type: "reference", name }
		: { type: "reference", name, fallback };
}

function css(...parts: Array<string | TokenValue>): CSS {
	return { type: "css", value: parts as Array<TokenValue> };
}

function ctx(...vars: Array<Variable>) {
	const map = new Map<string, Variable>();
	for (const variable of vars) {
		map.set(variable.name, variable);
	}
	return { variables: map };
}

describe("evaluateValue — primitives", () => {
	it("returns a string primitive unchanged", () => {
		expect(evaluateValue("16px", ctx())).toEqual({ resolved: "16px" });
	});

	it("returns a number primitive unchanged", () => {
		expect(evaluateValue(42, ctx())).toEqual({ resolved: 42 });
	});

	it("returns a boolean primitive unchanged", () => {
		expect(evaluateValue(true, ctx())).toEqual({ resolved: true });
	});

	it("returns null for null/undefined with a reason", () => {
		expect(evaluateValue(null, ctx()).resolved).toBeNull();
		expect(evaluateValue(undefined, ctx()).resolved).toBeNull();
	});
});

describe("evaluateValue — references", () => {
	it("resolves a bare reference and reports the alias target", () => {
		const target = v("color.primary", "#ff0000");
		const result = evaluateValue(ref("color.primary"), ctx(target));
		expect(result.resolved).toBe("#ff0000");
		expect(result.aliasTarget).toBe("color.primary");
	});

	it("follows an alias chain transitively", () => {
		const a = v("a", 42);
		const b = v("b", ref("a"));
		const c = v("c", ref("b"));
		const result = evaluateValue(ref("c"), ctx(a, b, c));
		expect(result.resolved).toBe(42);
		expect(result.aliasTarget).toBe("c");
	});

	it("uses the reference fallback when the target is missing", () => {
		const result = evaluateValue(ref("missing", "fallback-value"), ctx());
		expect(result.resolved).toBe("fallback-value");
	});

	it("returns null with reason when the target is missing and no fallback", () => {
		const result = evaluateValue(ref("missing"), ctx());
		expect(result.resolved).toBeNull();
		expect(result.reason).toMatch(/Unknown reference target/);
	});

	it("detects cycles", () => {
		const a = v("a", ref("b"));
		const b = v("b", ref("a"));
		const result = evaluateValue(ref("a"), ctx(a, b));
		expect(result.resolved).toBeNull();
		expect(result.reason).toMatch(/cycle/i);
	});
});

describe("evaluateValue — CSS templates", () => {
	it("evaluates pure arithmetic", () => {
		const a = v("a", 2);
		const b = v("b", 3);
		const expr = css(ref("a"), " * ", ref("b"));
		const result = evaluateValue(expr, ctx(a, b));
		expect(result.resolved).toBe(6);
	});

	it("evaluates compound arithmetic", () => {
		const a = v("a", 1);
		const b = v("b", 2);
		const expr = css("(", ref("a"), " + ", ref("b"), ") * 4");
		const result = evaluateValue(expr, ctx(a, b));
		expect(result.resolved).toBe(12);
	});

	it("folds a string template that produces a recognisable CSS function", () => {
		const x = v("x", 0.42);
		const y = v("y", 0.58);
		const expr = css("cubic-bezier(", ref("x"), ", 0, ", ref("y"), ", 1)");
		const result = evaluateValue(expr, ctx(x, y));
		expect(result.resolved).toBe("cubic-bezier(0.42, 0, 0.58, 1)");
	});

	it("returns a folded CSS expression (with non-numeric parts) verbatim", () => {
		const a = v("a", "16px");
		const expr = css(ref("a"), " solid #000");
		const result = evaluateValue(expr, ctx(a));
		expect(result.resolved).toBe("16px solid #000");
	});

	it("returns null + cssExpression when a child reference is unresolvable", () => {
		const expr = css("clamp(", ref("missing"), ", 1vw, 100px)");
		const result = evaluateValue(expr, ctx());
		expect(result.resolved).toBeNull();
		expect(result.cssExpression).toContain("clamp(");
		expect(result.reason).toBeTruthy();
	});
});

describe("evaluateValue — fluid unit substitution", () => {
	it("normalises a real useFluidClamp expression to the max bound", () => {
		// Build the exact AST shape useFluidClamp emits, so this test fails the
		// moment that helper's CSS template diverges from what the substitution
		// regex covers.
		const s = styleframe();
		s.variable("fluid.min-width", 320, { default: true });
		s.variable("fluid.max-width", 1440, { default: true });
		s.variable("fluid.screen", "100vw", { default: true });
		s.variable(
			"fluid.breakpoint",
			s.css`calc((${s.ref("fluid.screen")} - ${s.ref("fluid.min-width")} / 16 * 1rem) / (${s.ref("fluid.max-width")} - ${s.ref("fluid.min-width")}))`,
			{ default: true },
		);
		const fontSizeMd = useFluidClamp(s, [16, 18]);

		const variableMap = new Map<string, Variable>();
		for (const variable of s.root.variables) {
			variableMap.set(variable.name, variable);
		}
		const result = evaluateValue(fontSizeMd, {
			variables: variableMap,
			maxViewport: 1440,
		});
		expect(result.resolved).toBe(18);
		expect(result.normalisationSource).toBe("fluid-max");
	});

	it("substitutes 100vw + 1rem to a concrete pixel number", () => {
		// Synthetic case: confirms the regex covers the basic primitives even
		// without the full fluid-clamp shape.
		const a = v("a", "100vw");
		const b = v("b", "1rem");
		const expr = css("calc(", ref("a"), " + ", ref("b"), ")");
		const result = evaluateValue(expr, {
			variables: new Map([
				["a", a],
				["b", b],
			]),
			maxViewport: 1440,
		});
		// 100vw -> 1440, 1rem -> (1 * 16) = 16, total 1456
		expect(result.resolved).toBe(1456);
		expect(result.normalisationSource).toBe("fluid-max");
	});

	it("falls through to verbatim string when an un-substituted unit (vh) remains", () => {
		const a = v("a", "50vh");
		const expr = css("calc(", ref("a"), " + 1rem)");
		const result = evaluateValue(expr, {
			variables: new Map([["a", a]]),
			maxViewport: 1440,
		});
		// vh isn't covered by the substitution — must NOT silently produce a number.
		expect(result.normalisationSource).toBeUndefined();
		expect(typeof result.resolved).toBe("string");
		expect(result.resolved).toContain("50vh");
	});

	it("does not flag plain arithmetic as fluid-normalised", () => {
		const a = v("a", 2);
		const b = v("b", 3);
		const expr = css(ref("a"), " * ", ref("b"));
		const result = evaluateValue(expr, ctx(a, b));
		// Primary arithmetic path handled it; substitution fallback never ran.
		expect(result.resolved).toBe(6);
		expect(result.normalisationSource).toBeUndefined();
	});
});
