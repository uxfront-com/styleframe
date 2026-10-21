import type { Styleframe } from "../styleframe";
import { findVariableInScope } from "../tokens/resolve";
import { isCSS, isRef, isTokenValue } from "../typeGuards";
import type {
	AtRule,
	Container,
	ContainerChild,
	Reference,
	Root,
	Selector,
	Theme,
	TokenValue,
	Utility,
	UtilityFactory,
	VariantDeclarationsBlock,
} from "../types";
import type { Diagnostic, DiagnosticSeverity } from "./types";

const SEPARATOR = " › ";
const MAX_SUGGESTION_DISTANCE = 2;

type ScopeToken = Root | Theme | Selector | AtRule | Utility;

type ReportFn = (reference: string, path: string[], scope: Container) => void;

type UtilityProblems = {
	utility: string;
	key: string;
	problems: Array<{ reference: string; path: string[]; scope: Container }>;
};

/**
 * Checks a finished Styleframe instance and returns every problem in one pass:
 * references that resolve to no variable, theme overrides of variables that
 * aren't defined at root, and variables defined twice. Never throws.
 */
export function validate(instance: Styleframe): Diagnostic[] {
	const { root } = instance;
	const severity: DiagnosticSeverity = instance.options.strict
		? "error"
		: "warning";
	const diagnostics: Diagnostic[] = [];

	const reportUnresolved: ReportFn = (reference, path, scope) => {
		const suggestion = findSuggestion(
			reference,
			collectVisibleNames(scope, root),
		);
		diagnostics.push({
			code: "unresolved-reference",
			severity,
			message: `Reference "@${reference}" resolves to no variable.${
				suggestion ? ` Did you mean "@${suggestion}"?` : ""
			}`,
			path: path.join(SEPARATOR),
			...(suggestion ? { suggestion } : {}),
		});
	};

	// Selectors, at-rules, and variables at root
	walkContainer(root, [], root, reportUnresolved);

	// Utility values, grouped by the utility and key that generated them
	const utilityProblems = collectUtilityProblems(root);

	// Recipes report the problems of the utility values they generated
	const covered = new Set<string>();
	for (const recipe of root.recipes) {
		const visitBlock = (
			block: VariantDeclarationsBlock | null | undefined,
			path: string[],
		) => {
			if (!block) return;

			for (const [key, value] of Object.entries(block)) {
				if (
					typeof value === "object" &&
					value !== null &&
					!isTokenValue(value)
				) {
					for (const [utilityKey, utilityValue] of Object.entries(value)) {
						visitDeclaration(utilityKey, utilityValue, [
							...path,
							key,
							utilityKey,
						]);
					}
				} else {
					visitDeclaration(key, value, [...path, key]);
				}
			}
		};

		const visitDeclaration = (
			utilityKey: string,
			value: TokenValue,
			path: string[],
		) => {
			const factory = findUtilityFactory(root, utilityKey);
			if (!factory) return;

			for (const key of Object.keys(factory.autogenerate(value))) {
				const id = `${factory.name}|${key}`;
				covered.add(id);

				for (const problem of utilityProblems.get(id)?.problems ?? []) {
					reportUnresolved(problem.reference, path, problem.scope);
				}
			}
		};

		const prefix = `recipe "${recipe.name}"`;
		visitBlock(recipe.base, [prefix, "base"]);

		for (const [group, options] of Object.entries(recipe.variants ?? {})) {
			for (const [option, block] of Object.entries(options)) {
				visitBlock(block, [prefix, "variants", group, option]);
			}
		}

		recipe.compoundVariants?.forEach((compoundVariant, index) => {
			visitBlock(compoundVariant.css, [prefix, `compoundVariants[${index}]`]);
		});
	}

	for (const [id, { utility, key, problems }] of utilityProblems) {
		if (covered.has(id)) continue;

		for (const problem of problems) {
			reportUnresolved(
				problem.reference,
				[`utility "${utility}"`, key, ...problem.path],
				problem.scope,
			);
		}
	}

	// Themes
	const rootNames = root.variables.map((variable) => variable.name);
	for (const theme of root.themes) {
		const prefix = `theme "${theme.name}"`;

		for (const variable of theme.variables) {
			if (rootNames.includes(variable.name)) continue;

			const suggestion = findSuggestion(variable.name, rootNames);
			diagnostics.push({
				code: "undefined-theme-override",
				severity,
				message: `Theme "${theme.name}" overrides "${variable.name}", which isn't defined at root.${
					suggestion ? ` Did you mean "${suggestion}"?` : ""
				}`,
				path: [prefix, `variable "${variable.name}"`].join(SEPARATOR),
				...(suggestion ? { suggestion } : {}),
			});
		}

		walkContainer(theme, [prefix], root, reportUnresolved);
	}

	// Variables defined twice, recorded when variable() overwrote them
	for (const record of root._records ?? []) {
		if (record.type !== "duplicate-variable") continue;

		const [first, last] = record.values;
		diagnostics.push({
			code: "duplicate-variable",
			severity,
			message: `Variable "${record.name}" is defined twice: "${formatValue(first)}", then "${formatValue(last)}". The last value wins.`,
			path: [
				...describeScope(record.scopeId, root),
				`variable "${record.name}"`,
			].join(SEPARATOR),
		});
	}

	return diagnostics;
}

function collectUtilityProblems(root: Root): Map<string, UtilityProblems> {
	const problemsById = new Map<string, UtilityProblems>();

	const addProblem = (
		utility: string,
		key: string,
		reference: string,
		path: string[],
		scope: Container,
	) => {
		const id = `${utility}|${key}`;
		let entry = problemsById.get(id);
		if (!entry) {
			entry = { utility, key, problems: [] };
			problemsById.set(id, entry);
		}

		// Modified variants repeat the base value's references
		if (!entry.problems.some((problem) => problem.reference === reference)) {
			entry.problems.push({ reference, path, scope });
		}
	};

	for (const child of root.children) {
		if (child.type !== "utility") continue;

		walkContainer(child, [], root, (reference, path, scope) =>
			addProblem(child.name, child.value, reference, path, scope),
		);
	}

	// Namespace fallbacks that found no variable and fell back to the key
	for (const record of root._records ?? []) {
		if (record.type !== "unresolved-utility-value") continue;

		addProblem(record.utility, record.key, record.reference, [], root);
	}

	return problemsById;
}

function walkContainer(
	container: Container,
	path: string[],
	root: Root,
	report: ReportFn,
): void {
	const checkValue = (value: TokenValue, valuePath: string[]) => {
		for (const reference of collectReferences(value)) {
			if (!isDefined(reference.name, container, root)) {
				report(reference.name, valuePath, container);
			}
		}
	};

	for (const variable of container.variables) {
		checkValue(variable.value, [...path, `variable "${variable.name}"`]);
	}

	for (const [property, value] of Object.entries(container.declarations)) {
		if (isTokenValue(value)) {
			checkValue(value, [...path, property]);
		}
	}

	for (const child of container.children) {
		walkChild(child, container, path, root, report, checkValue);
	}
}

function walkChild(
	child: ContainerChild,
	parent: Container,
	path: string[],
	root: Root,
	report: ReportFn,
	checkValue: (value: TokenValue, path: string[]) => void,
): void {
	if (child.type === "variable") {
		checkValue(child.value, [...path, `variable "${child.name}"`]);
		return;
	}

	// Utilities generated at root are checked by collectUtilityProblems
	if (child.type === "utility" && parent === root) return;

	walkContainer(child, [...path, ...describeToken(child)], root, report);
}

/**
 * Collects the references that must resolve. A reference with a fallback
 * resolves to its fallback, so only the references inside the fallback count.
 */
function collectReferences(value: TokenValue): Reference[] {
	if (isRef(value)) {
		return value.fallback != null ? collectReferences(value.fallback) : [value];
	}

	if (isCSS(value)) {
		return value.value.flatMap(collectReferences);
	}

	if (Array.isArray(value)) {
		return value.flatMap(collectReferences);
	}

	return [];
}

function isDefined(name: string, scope: Container, root: Root): boolean {
	// Merged instances keep their children's parentId, which may point at a
	// root that is no longer registered, so root is always checked last.
	return (
		findVariableInScope(name, scope, root) ||
		root.variables.some((variable) => variable.name === name)
	);
}

function collectVisibleNames(scope: Container, root: Root): string[] {
	const names = new Set<string>();
	let current: Container | undefined = scope;
	while (current) {
		for (const variable of current.variables) names.add(variable.name);
		current = current.parentId
			? root._registry.get(current.parentId)
			: undefined;
	}

	for (const variable of root.variables) names.add(variable.name);

	return [...names];
}

function findUtilityFactory(
	root: Root,
	name: string,
): UtilityFactory | undefined {
	const kebabName = name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
	return (
		root.utilities.find((utility) => utility.name === name) ??
		root.utilities.find((utility) => utility.name === kebabName)
	);
}

function describeScope(scopeId: string, root: Root): string[] {
	const path: string[] = [];
	let current = root._registry.get(scopeId) as ScopeToken | undefined;
	while (current && current.type !== "root") {
		path.unshift(...describeToken(current));
		current = current.parentId
			? (root._registry.get(current.parentId) as ScopeToken | undefined)
			: undefined;
	}

	return path;
}

function describeToken(token: Exclude<ScopeToken, Root>): string[] {
	switch (token.type) {
		case "theme":
			return [`theme "${token.name}"`];
		case "selector":
			return [`selector "${token.query}"`];
		case "at-rule":
			return [`@${token.identifier}${token.rule ? ` ${token.rule}` : ""}`];
		case "utility":
			return [`utility "${token.name}"`, token.value];
	}
}

function formatValue(value: TokenValue): string {
	if (isRef(value)) return `@${value.name}`;
	if (isCSS(value)) return value.value.map(formatValue).join("");
	if (Array.isArray(value)) return value.map(formatValue).join(", ");
	return String(value);
}

function findSuggestion(
	name: string,
	candidates: string[],
): string | undefined {
	let best: string | undefined;
	let bestDistance = MAX_SUGGESTION_DISTANCE + 1;

	for (const candidate of candidates) {
		if (candidate === name) continue;

		const distance = editDistance(name, candidate);
		if (distance < bestDistance) {
			best = candidate;
			bestDistance = distance;
		}
	}

	return best;
}

function editDistance(a: string, b: string): number {
	if (Math.abs(a.length - b.length) > MAX_SUGGESTION_DISTANCE) {
		return Number.POSITIVE_INFINITY;
	}

	let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const current = [i];
		for (let j = 1; j <= b.length; j++) {
			current[j] = Math.min(
				(previous[j] ?? 0) + 1,
				(current[j - 1] ?? 0) + 1,
				(previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
			);
		}
		previous = current;
	}

	return previous[b.length] ?? 0;
}
