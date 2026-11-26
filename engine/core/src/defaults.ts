import { isRef } from "./typeGuards";
import type { Reference, TokenValue } from "./types";
import type { UtilitySelectorFn } from "./types/options";
import { hashValue } from "./utils/hash";

export interface TransformUtilityKeyOptions {
	/** Transforms the key used in the utility class name */
	replacer?: (key: string) => string;
	/** Namespace prepended to the reference name (e.g., "spacing" makes "@sm" resolve to ref("spacing.sm")) */
	namespace?: string | Array<string>;
}

export function transformUtilityKey(
	replacerOrOptions?: ((key: string) => string) | TransformUtilityKeyOptions,
) {
	const options: TransformUtilityKeyOptions =
		typeof replacerOrOptions === "function"
			? { replacer: replacerOrOptions }
			: (replacerOrOptions ?? {});

	const { replacer = (v) => v, namespace } = options;
	const namespaces = Array.isArray(namespace)
		? namespace
		: namespace
			? [namespace]
			: [];

	return (value: TokenValue): Record<string, TokenValue> => {
		let resolvedValue = value;
		let resolvedKey: string;

		if (typeof resolvedValue === "string" && resolvedValue[0] === "@") {
			const variableName = resolvedValue.slice(1);

			// Check if the variable name already starts with a namespace prefix
			// to avoid double-prepending (e.g., "@color.light" with namespace "color"
			// should resolve to "color.light", not "color.color.light")
			const matchedNs = namespaces.find(
				(ns) => variableName === ns || variableName.startsWith(`${ns}.`),
			);

			let referenceName: string;
			let keyName: string;

			if (matchedNs) {
				// Already namespace-prefixed, use as-is
				referenceName = variableName;
				keyName = variableName.startsWith(`${matchedNs}.`)
					? variableName.slice(matchedNs.length + 1)
					: variableName;
			} else if (namespaces.length > 0) {
				referenceName = `${namespaces[0]}.${variableName}`;
				keyName = variableName;
			} else {
				referenceName = variableName;
				keyName = variableName;
			}

			resolvedKey = replacer(keyName);
			resolvedValue = {
				type: "reference",
				name: referenceName,
			} satisfies Reference<string>;
		} else if (isRef(resolvedValue)) {
			let keyName = resolvedValue.name;
			for (const ns of namespaces) {
				if (keyName.startsWith(`${ns}.`)) {
					keyName = keyName.slice(ns.length + 1);
					break;
				}
			}
			resolvedKey = replacer(keyName);
		} else {
			const trimmedValue = String(value).trim();
			if (/\s/.test(trimmedValue)) {
				resolvedKey = hashValue(trimmedValue);
			} else {
				resolvedKey = `[${trimmedValue}]`;
			}
		}

		return {
			[resolvedKey]: resolvedValue,
		};
	};
}

export const defaultUtilitySelectorFn: UtilitySelectorFn = ({
	name,
	value,
	modifiers,
}) => {
	const parts = [
		...modifiers,
		name,
		...(value === "default" ? [] : [value]),
	].filter(Boolean);

	return `_${parts.join(":")}`;
};
