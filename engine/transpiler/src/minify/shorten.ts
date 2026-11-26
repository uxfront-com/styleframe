import type {
	Root,
	ShorteningMap,
	UtilitySelectorFn,
	UtilitySelectorOptions,
} from "@styleframe/core";

import { defaultUtilitySelectorFn } from "../defaults";

export function shortenUtilityOptions(
	opts: UtilitySelectorOptions,
	map: ShorteningMap,
): UtilitySelectorOptions {
	return {
		name: map.p[opts.name] ?? opts.name,
		value: opts.value === "default" ? opts.value : (map.v[opts.value] ?? opts.value),
		modifiers: opts.modifiers.map((m) => map.m[m] ?? m),
	};
}

export function buildClassNameLookup(
	root: Root,
	map: ShorteningMap,
	selectorFn: UtilitySelectorFn = defaultUtilitySelectorFn,
): Record<string, string> {
	const lookup: Record<string, string> = {};

	const processChildren = (children: Root["children"]) => {
		for (const child of children) {
			if (child.type !== "utility") {
				continue;
			}

			const opts: UtilitySelectorOptions = {
				name: child.name,
				value: child.value,
				modifiers: child.modifiers,
			};
			const fullName = selectorFn(opts);
			const shortName = selectorFn(shortenUtilityOptions(opts, map));

			if (fullName !== shortName) {
				lookup[fullName] = shortName;
			}
		}
	};

	processChildren(root.children);
	for (const theme of root.themes) {
		processChildren(theme.children);
	}

	return lookup;
}
