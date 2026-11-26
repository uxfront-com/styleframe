import type {
	ModifierFactory,
	Root,
	Utility,
	UtilityFactory,
	UtilitySelectorFn,
	UtilitySelectorOptions,
} from "@styleframe/core";
import {
	classNameToCssSelector,
	defaultUtilitySelectorFn,
} from "@styleframe/core";
import type { ParsedUtility, UtilityMatch } from "./types";

/**
 * Generate a normalized cache key for utility value lookup.
 * Sorts modifiers alphabetically to ensure consistent keys regardless of order.
 */
function generateValueKey(value: string, modifiers: Array<string>): string {
	if (modifiers.length === 0) {
		return value;
	}
	const sortedModifiers = [...modifiers].sort().join(",");
	return `${value}|${sortedModifiers}`;
}

/**
 * Match parsed utility classes against registered utilities in the root.
 *
 * @param parsed Array of parsed utility classes
 * @param root The Styleframe root instance
 * @returns Array of match results
 */
export function matchUtilities(
	parsed: Array<ParsedUtility>,
	root: Root,
): Array<UtilityMatch> {
	// Build lookup maps for efficient matching
	const utilityMap = new Map<string, UtilityFactory>();
	const modifierMap = new Map<string, ModifierFactory>();
	// Pre-compute value key sets for O(1) existence checks
	const factoryValueSets = new Map<UtilityFactory, Set<string>>();

	for (const utility of root.utilities) {
		utilityMap.set(utility.name, utility);
		// Build the value key set for this factory
		const valueSet = new Set<string>();
		for (const v of utility.values) {
			valueSet.add(generateValueKey(v.key, v.modifiers));
		}
		factoryValueSets.set(utility, valueSet);
	}

	for (const modifier of root.modifiers) {
		for (const key of modifier.key) {
			modifierMap.set(key, modifier);
		}
	}

	const matches: Array<UtilityMatch> = [];

	for (const parsedClass of parsed) {
		const factory = utilityMap.get(parsedClass.name) ?? null;
		const matchedModifiers: Array<ModifierFactory> = [];

		// Find matching modifier factories
		for (const modKey of parsedClass.modifiers) {
			const modifier = modifierMap.get(modKey);
			if (modifier) {
				matchedModifiers.push(modifier);
			}
		}

		// Check if the value exists in the factory using O(1) Set lookup
		let exists = false;

		if (factory) {
			const lookupKey = generateValueKey(
				parsedClass.value,
				parsedClass.modifiers,
			);
			const valueSet = factoryValueSets.get(factory);
			exists = valueSet?.has(lookupKey) ?? false;
		}

		matches.push({
			parsed: parsedClass,
			factory,
			modifierFactories: matchedModifiers,
			exists,
		});
	}

	return matches;
}

/**
 * Generate the CSS selector for a utility instance.
 *
 * Derives the selector from the class name by adding a `.` prefix and escaping special characters.
 */
export function generateUtilitySelector(
	options: UtilitySelectorOptions,
	selectorFn?: UtilitySelectorFn,
): string {
	const className = classNameFromUtilityOptions(options, selectorFn);
	return classNameToCssSelector(className);
}

/**
 * Generate the raw utility class name from options (without CSS escaping).
 */
export function classNameFromUtilityOptions(
	options: UtilitySelectorOptions,
	selectorFn?: UtilitySelectorFn,
): string {
	return (selectorFn ?? defaultUtilitySelectorFn)(options);
}

/**
 * Create a filter function that checks if a utility is in the used set.
 *
 * @param usedClasses Set of used utility class names
 * @param selectorFn Optional custom selector function
 * @returns Filter function for utilities
 */
export function createUtilityFilter(
	usedClasses: Set<string>,
	selectorFn?: UtilitySelectorFn,
): (utility: Utility) => boolean {
	return (utility: Utility) => {
		const className = classNameFromUtilityOptions(
			{
				name: utility.name,
				value: utility.value,
				modifiers: utility.modifiers,
			},
			selectorFn,
		);
		return usedClasses.has(className);
	};
}

/**
 * Filter root children to only include used utilities.
 *
 * @param root The Styleframe root instance
 * @param usedClasses Set of used utility class names
 * @param selectorFn Optional custom selector function
 * @returns Array of used children (utilities are filtered, other types pass through)
 */
export function filterUtilities(
	root: Root,
	usedClasses: Set<string>,
	selectorFn?: UtilitySelectorFn,
): Root["children"] {
	const filter = createUtilityFilter(usedClasses, selectorFn);

	return root.children.filter((child) => {
		// Non-utility children always pass through
		if (child.type !== "utility") {
			return true;
		}

		return filter(child);
	});
}

/**
 * Get all unique utility class names from matches.
 */
export function getUsedClassNames(matches: Array<UtilityMatch>): Set<string> {
	const classNames = new Set<string>();

	for (const match of matches) {
		classNames.add(match.parsed.raw);
	}

	return classNames;
}

/**
 * Get matches that have a corresponding utility factory.
 */
export function getValidMatches(
	matches: Array<UtilityMatch>,
): Array<UtilityMatch> {
	return matches.filter((m) => m.factory !== null);
}

/**
 * Get matches that exist in the registered values.
 */
export function getExistingMatches(
	matches: Array<UtilityMatch>,
): Array<UtilityMatch> {
	return matches.filter((m) => m.exists);
}

/**
 * Get matches for arbitrary values.
 */
export function getArbitraryMatches(
	matches: Array<UtilityMatch>,
): Array<UtilityMatch> {
	return matches.filter((m) => m.parsed.isArbitrary);
}
