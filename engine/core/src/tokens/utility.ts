import { transformUtilityKey } from "../defaults";
import { isModifier, isRef } from "../typeGuards";
import type {
	Container,
	ModifierFactory,
	Reference,
	Root,
	TokenValue,
	Utility,
	UtilityAutogenerateFn,
	UtilityCallbackFn,
	UtilityCreatorFn,
	UtilityFactory,
} from "../types";
import { generateRandomId } from "../utils";
import {
	createDeclarationsCallbackContext,
	parseDeclarationsBlock,
} from "./declarations";
import { applyModifiers } from "./modifier";
import { trackReferenceUsage } from "./resolve";

/**
 * Create an autogenerate function for namespace arrays that resolves
 * against root.variables to pick the first namespace with a defined variable.
 */
function createNamespaceAutogenerate(
	namespaces: string[],
	root: Root,
): UtilityAutogenerateFn {
	const baseTransform = transformUtilityKey({ namespace: namespaces });

	return (value: TokenValue): Record<string, TokenValue> => {
		if (typeof value === "string" && value[0] === "@") {
			const variableName = value.slice(1);

			// Check if variable already starts with a namespace prefix
			// to avoid double-prepending (e.g., "@color.light" with namespace "color")
			const matchedNs = namespaces.find(
				(ns) => variableName === ns || variableName.startsWith(`${ns}.`),
			);

			if (matchedNs) {
				const keyName =
					variableName.slice(matchedNs.length + 1) || variableName;
				if (root.variables.some((v) => v.name === variableName)) {
					root._usage.variables.add(variableName);
					return {
						[keyName]: {
							type: "reference",
							name: variableName,
						} satisfies Reference<string>,
					};
				}
				// Variable not found with namespace prefix, fall through to baseTransform
			} else {
				// Try each namespace and pick the first with a defined variable
				for (const ns of namespaces) {
					const candidateName = `${ns}.${variableName}`;
					if (root.variables.some((v) => v.name === candidateName)) {
						root._usage.variables.add(candidateName);
						return {
							[variableName]: {
								type: "reference",
								name: candidateName,
							} satisfies Reference<string>,
						};
					}
				}

				// Check if variable exists with its exact name (cross-namespace reference)
				if (root.variables.some((v) => v.name === variableName)) {
					root._usage.variables.add(variableName);
					return {
						[variableName]: {
							type: "reference",
							name: variableName,
						} satisfies Reference<string>,
					};
				}
			}

			// No variable found — fall back to first namespace as default
			return baseTransform(value);
		}

		// For non-@ values (refs, arbitrary), delegate to base transform
		return baseTransform(value);
	};
}

/**
 * Expand a group of modifiers into key maps for applyModifiers.
 *
 * A single modifier with key: ["sm", "md", "lg"] expands into 3 maps:
 *   [{sm: mod}], [{md: mod}], [{lg: mod}]
 *
 * Multiple single-key modifiers [hover, dark] produce one map:
 *   [{hover: hoverMod, dark: darkMod}]
 *
 * For mixed cases (multi-key + others), takes the cartesian product.
 */
function expandModifierGroup(
	group: ModifierFactory[],
): Map<string, ModifierFactory>[] {
	// Start with a single empty map
	let results: Map<string, ModifierFactory>[] = [new Map()];

	for (const modifier of group) {
		if (!isModifier(modifier)) continue;

		const newResults: Map<string, ModifierFactory>[] = [];
		for (const modKey of modifier.key) {
			for (const existing of results) {
				const copy = new Map(existing);
				copy.set(modKey, modifier);
				newResults.push(copy);
			}
		}
		results = newResults;
	}

	// Filter out the empty map if nothing was added
	return results.filter((m) => m.size > 0);
}

export function createUtilityFunction(parent: Container, root: Root) {
	return function utility<Name extends string>(
		name: Name,
		factory: UtilityCallbackFn,
		options: {
			autogenerate?: UtilityAutogenerateFn;
			namespace?: string | string[];
		} = {},
	): UtilityCreatorFn {
		const existingFactory = root.utilities.find((f) => f.name === name);
		if (existingFactory) {
			return existingFactory.create;
		}

		const factoryInstance: UtilityFactory<Name> = {
			type: "utility",
			name,
			factory,
			values: [],
			autogenerate:
				options.autogenerate ??
				(Array.isArray(options.namespace)
					? createNamespaceAutogenerate(options.namespace, root)
					: transformUtilityKey(
							options.namespace ? { namespace: options.namespace } : undefined,
						)),
			namespace: options.namespace,
			create: (entries, modifiers = []) => {
				let resolvedEntries = entries;

				if (Array.isArray(entries)) {
					/**
					 * If entries is an array, convert it to an object with relevant keys and values
					 *
					 * @example Arbitrary value: ['red'] => { '[red]': 'red' }
					 * @example Token reference: ['@color.primary'] => { 'color.primary': ref('color.primary') }
					 * @example Token reference with replacement: ['@color.primary'] => { 'primary': ref('color.primary') }
					 */
					resolvedEntries = {};

					for (const value of entries) {
						const autogeneratedEntries = factoryInstance.autogenerate(value);

						for (const generated of Object.values(autogeneratedEntries)) {
							trackReferenceUsage(root, generated);
						}

						resolvedEntries = {
							...resolvedEntries,
							...autogeneratedEntries,
						};
					}
				}

				for (const [key, entryValue] of Object.entries(resolvedEntries)) {
					let value = entryValue;

					// Resolve @-prefixed string values as references to sibling keys
					// e.g. { default: "@solid", solid: "solid" } → default resolves to "solid"
					if (typeof entryValue === "string" && entryValue[0] === "@") {
						const referencedKey = entryValue.slice(1);
						if (
							!Array.isArray(resolvedEntries) &&
							referencedKey in resolvedEntries
						) {
							value = resolvedEntries[referencedKey];
						}
					}

					if (factoryInstance.namespace && isRef(entryValue)) {
						if (root.variables.some((v) => v.name === entryValue.name)) {
							value = entryValue;
							root._usage.variables.add(entryValue.name);
						} else {
							const namespaces = Array.isArray(factoryInstance.namespace)
								? factoryInstance.namespace
								: [factoryInstance.namespace];

							let found = false;
							for (const ns of namespaces) {
								const candidateName = `${ns}.${key}`;
								if (
									candidateName !== entryValue.name &&
									root.variables.some((v) => v.name === candidateName)
								) {
									value = {
										type: "reference",
										name: candidateName,
									} satisfies Reference<string>;
									root._usage.variables.add(candidateName);
									found = true;
									break;
								}
							}

							if (!found) {
								// Check if variable exists with exact key name (cross-namespace reference)
								if (root.variables.some((v) => v.name === key)) {
									value = {
										type: "reference",
										name: key,
									} satisfies Reference<string>;
									root._usage.variables.add(key);
								} else {
									root._records?.push({
										type: "unresolved-utility-value",
										utility: name,
										key,
										reference: entryValue.name,
									});
									value = key;
								}
							}
						}
					}

					const existingEntry = factoryInstance.values.find(
						(entry) => entry.key === key && entry.modifiers.length === 0,
					);

					const instance: Utility<Name> = {
						type: "utility",
						id: generateRandomId("ut-"),
						parentId: parent.id,
						name,
						value: key,
						declarations: {},
						variables: [],
						children: [],
						modifiers: [],
					};

					root._registry.set(instance.id, instance);

					const callbackContext = createDeclarationsCallbackContext(
						instance,
						root,
					);

					instance.declarations =
						factory({
							...callbackContext,
							value,
						}) ?? {};

					parseDeclarationsBlock(
						instance.declarations,
						callbackContext,
						instance,
						root,
					);

					if (!existingEntry) {
						factoryInstance.values.push({
							key,
							value,
							modifiers: [],
						});

						// Store the utility value on the instance
						parent.children.push(instance);
					}

					// Create modified variants for this specific value
					if (modifiers && modifiers.length > 0) {
						for (const entry of modifiers) {
							// Normalize: single modifier → [modifier], array stays as-is
							const group = Array.isArray(entry) ? entry : [entry];

							// Expand multi-key modifiers into individual key applications
							const keyMaps = expandModifierGroup(group);

							for (const modifiersByKey of keyMaps) {
								const combination = [...modifiersByKey.keys()];

								// Skip duplicates
								const isDuplicate = factoryInstance.values.find(
									(existing) =>
										existing.key === key &&
										existing.modifiers.length === combination.length &&
										existing.modifiers.every(
											(mod, i) => mod === combination[i],
										),
								);

								if (!isDuplicate) {
									factoryInstance.values.push({
										key,
										value,
										modifiers: combination,
									});

									parent.children.push(
										applyModifiers(instance, root, modifiersByKey),
									);
								}
							}
						}
					}
				}
			},
		};

		root.utilities.push(factoryInstance);

		return factoryInstance.create;
	};
}
