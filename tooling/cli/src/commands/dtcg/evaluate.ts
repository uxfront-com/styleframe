/**
 * Reduce a Styleframe `Variable.value` (a `TokenValue`) to a concrete primitive
 * suitable for DTCG export.
 *
 * Three outcomes:
 *
 *   - **Single reference** — the value is a `Reference` (alone). We resolve
 *     transitively to its target's primitive but also report the alias target
 *     so the caller can emit a DTCG alias instead of inlining the value.
 *   - **Reduced** — the value is a primitive, or a `CSS` template that we can
 *     fully reduce to a single primitive (pure arithmetic, or a string-template
 *     that produces a known CSS-function string like `cubic-bezier(...)`).
 *   - **Unevaluable** — the value mixes references with CSS-only constructs
 *     (`clamp()`, `vw`, `calc()` over heterogeneous units, etc.). We return
 *     `resolved: null` and the best-effort string form in `cssExpression` so
 *     the caller can attach it as a `dev.styleframe.expression` extension.
 */

import type { Reference, CSS as StyleframeCSS, TokenValue, Variable } from "@styleframe/core";

export interface EvaluateContext {
	variables: Map<string, Variable>;
	/** Visited variable names — used to detect ref cycles. */
	visited?: Set<string>;
	/**
	 * Viewport width in px substituted for `100vw` when reducing fluid
	 * expressions. Defaults to `1440` (the styleframe theme's default
	 * `fluid.max-width`); pass an explicit value when the project overrides it.
	 */
	maxViewport?: number;
}

export interface EvaluatedValue {
	/** Concrete primitive form, or `null` if the expression couldn't be reduced. */
	resolved: string | number | boolean | null;
	/** When the expression is exactly one reference, this is the target name. */
	aliasTarget?: string;
	/** Original CSS-string form, populated when `resolved` is null. */
	cssExpression?: string;
	/** Diagnostic reason, populated when `resolved` is null. */
	reason?: string;
	/**
	 * Set when the value was derived via unit substitution (`100vw` → max
	 * viewport, `rem` → px) rather than direct arithmetic. Lets callers attach
	 * a `dev.styleframe.fluidBound` extension so the substitution is auditable.
	 */
	normalisationSource?: "fluid-max";
}

function isReference(value: unknown): value is Reference {
	return (
		typeof value === "object" &&
		value !== null &&
		"type" in value &&
		(value as { type: string }).type === "reference"
	);
}

function isCss(value: unknown): value is StyleframeCSS {
	return (
		typeof value === "object" &&
		value !== null &&
		"type" in value &&
		(value as { type: string }).type === "css"
	);
}

function isPrimitive(value: unknown): value is string | number | boolean {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

/**
 * Resolve a Reference's *primitive* value (following alias chains). Returns
 * null if the chain is broken (missing target or cycle).
 */
function resolveReferenceTarget(ref: Reference, context: EvaluateContext): EvaluatedValue {
	const visited = context.visited ?? new Set<string>();
	if (visited.has(ref.name)) {
		return {
			resolved: null,
			reason: `Reference cycle: ${[...visited, ref.name].join(" → ")}`,
		};
	}
	const target = context.variables.get(ref.name);
	if (!target) {
		// Use fallback if the target is unknown.
		if (ref.fallback !== undefined && ref.fallback !== null) {
			return evaluateValue(ref.fallback, context);
		}
		return { resolved: null, reason: `Unknown reference target: ${ref.name}` };
	}
	const nextContext: EvaluateContext = {
		variables: context.variables,
		visited: new Set([...visited, ref.name]),
		maxViewport: context.maxViewport,
	};
	return evaluateValue(target.value, nextContext);
}

/**
 * Try to evaluate a CSS template literal. Two strategies:
 *
 *   1. **String-template fold**: replace each `Reference` part with its
 *      resolved primitive (stringified) and concatenate. If the resulting
 *      string parses as a known CSS form (cubic-bezier(...), a hex color,
 *      a dimension, a duration), return it.
 *   2. **Pure arithmetic**: if every part reduces to a finite number or one
 *      of `+`/`-`/`*`/`/`/`(`/`)` operators with whitespace, evaluate the
 *      arithmetic and return the numeric result.
 *
 * Otherwise, return `{resolved: null, cssExpression: <fold>}` so the caller
 * can preserve the expression in an extension.
 */
function evaluateCss(css: StyleframeCSS, context: EvaluateContext): EvaluatedValue {
	const parts: Array<{
		kind: "literal" | "value";
		text: string;
		numeric?: number;
	}> = [];
	let unevaluable = false;
	let unevaluableReason: string | undefined;

	for (const part of css.value) {
		if (typeof part === "string") {
			parts.push({ kind: "literal", text: part });
			continue;
		}
		const evaluated = evaluateValue(part as TokenValue, context);
		if (evaluated.resolved === null) {
			unevaluable = true;
			unevaluableReason = evaluated.reason;
			parts.push({ kind: "value", text: "" });
			continue;
		}
		const text = String(evaluated.resolved);
		const numeric = typeof evaluated.resolved === "number" ? evaluated.resolved : undefined;
		parts.push({ kind: "value", text, numeric });
	}

	const folded = parts.map((p) => p.text).join("");

	if (unevaluable) {
		return {
			resolved: null,
			cssExpression: folded,
			reason: unevaluableReason ?? "Computed expression includes an unresolvable reference",
		};
	}

	// Try arithmetic: every literal must contain only digits, dots,
	// whitespace, parentheses, and arithmetic operators; every value must be
	// numeric. Literals can carry numeric constants (e.g. `") * 4"`).
	const isPureArithmetic = parts.every((p) => {
		if (p.kind === "value") {
			return p.numeric !== undefined;
		}
		return /^[\d.\s+\-*/()]*$/.test(p.text);
	});

	if (isPureArithmetic && parts.some((p) => p.kind === "value")) {
		try {
			const result = safeArithmetic(folded.trim());
			if (typeof result === "number" && Number.isFinite(result)) {
				return { resolved: result };
			}
		} catch (error) {
			return {
				resolved: null,
				cssExpression: folded,
				reason: `Arithmetic evaluation failed: ${(error as Error).message}`,
			};
		}
	}

	// Fallback: substitute `100vw`, `rem`, and `px` literals so fluid
	// expressions (e.g. those produced by `useFluidClamp`) reduce to a
	// concrete pixel value at the locked max viewport. We only run this after
	// the standard arithmetic check fails, so well-formed numeric expressions
	// are unaffected.
	const subResult = substituteFluidUnits(folded, context.maxViewport ?? 1440);
	if (subResult && /^[\d.\s+\-*/()]+$/.test(subResult.rebased)) {
		try {
			const result = safeArithmetic(subResult.rebased.trim());
			if (typeof result === "number" && Number.isFinite(result)) {
				return {
					resolved: result,
					...(subResult.substituted ? { normalisationSource: "fluid-max" as const } : {}),
				};
			}
		} catch {
			// Fall through to the verbatim-string return below.
		}
	}

	// Otherwise return the folded string verbatim — downstream classification
	// can recognise things like `cubic-bezier(0.4, 0, 0.2, 1)`.
	return { resolved: folded };
}

/**
 * Replace fluid-friendly literals so a `calc()` expression mixing `100vw`,
 * `rem`, and `px` reduces to pure arithmetic.
 *
 * Returns `null` when the input still contains units we don't substitute
 * (e.g. `vh`, `%`, `em`) — the caller should fall back to the
 * verbatim-string path.
 *
 * `substituted` indicates whether at least one fluid unit was actually
 * substituted. `false` means we only stripped a bare `calc(...)` wrapper —
 * the expression was effectively pure arithmetic and the result should NOT
 * be flagged as fluid-normalised.
 */
function substituteFluidUnits(
	expression: string,
	maxViewport: number,
): { rebased: string; substituted: boolean } | null {
	let substituted = false;
	let rebased = expression.replaceAll(/\bcalc\b/g, "");
	if (rebased.includes("100vw")) {
		rebased = rebased.replaceAll("100vw", String(maxViewport));
		substituted = true;
	}
	if (/(-?\d*\.?\d+)\s*rem/.test(rebased)) {
		rebased = rebased.replaceAll(/(-?\d*\.?\d+)\s*rem/g, "($1 * 16)");
		substituted = true;
	}
	if (/(-?\d*\.?\d+)\s*px/.test(rebased)) {
		rebased = rebased.replaceAll(/(-?\d*\.?\d+)\s*px/g, "$1");
		substituted = true;
	}
	// If any non-digit/operator literals remain (vh, %, ch, em, etc.), the
	// expression isn't safely arithmetic — let the caller emit it verbatim.
	if (/[a-zA-Z%]/.test(rebased)) {
		return null;
	}
	return { rebased, substituted };
}

/**
 * Safe arithmetic over a whitespace-trimmed expression containing only
 * numbers, parentheses, and `+`/`-`/`*`/`/`. Throws on anything else.
 */
function safeArithmetic(expression: string): number {
	if (!/^[\d.\s+\-*/()]+$/.test(expression)) {
		throw new Error(`Disallowed characters in expression: "${expression}"`);
	}
	// Function constructor in a sandboxed string with no identifiers — the
	// regex above guarantees only digits, dots, whitespace, and operators.
	const fn = new Function(`return (${expression});`);
	return fn() as number;
}

export function evaluateValue(value: TokenValue, context: EvaluateContext): EvaluatedValue {
	if (value === null || value === undefined) {
		return { resolved: null, reason: "Value is null/undefined" };
	}

	if (isPrimitive(value)) {
		return { resolved: value };
	}

	if (isReference(value)) {
		const targetResolution = resolveReferenceTarget(value, context);
		// Preserve the alias target ONLY at the top level — when we descend
		// into a CSS template and resolve a child reference, we want the
		// concrete value, not a recursive alias.
		const isTopLevel = !context.visited || context.visited.size === 0;
		if (isTopLevel && targetResolution.resolved !== null) {
			return { ...targetResolution, aliasTarget: value.name };
		}
		return targetResolution;
	}

	if (isCss(value)) {
		return evaluateCss(value, context);
	}

	if (Array.isArray(value)) {
		// Heterogeneous arrays (CSS lists, multi-shadows) — out of scope for
		// the primitive evaluator. Caller should attach as an extension.
		return {
			resolved: null,
			reason: "Heterogeneous array — DTCG composite encoding not yet implemented",
		};
	}

	return {
		resolved: null,
		reason: `Unsupported value shape: ${typeof value}`,
	};
}
