import type { Root, ShorteningMap } from "@styleframe/core";
import { hashValue } from "@styleframe/core";
import {
	defaultModifierShortNames,
	defaultPropertyShortNames,
} from "./defaults";

export type ShorteningMapDefaults = {
	properties?: Record<string, string>;
	values?: Record<string, string>;
	modifiers?: Record<string, string>;
};

function abbreviateSegments(name: string, level = 0): string {
	const segments = name.split(/[-.]/);
	return segments
		.map((seg, i) => {
			const chars = i === segments.length - 1 ? 1 + level : 1;
			return seg.slice(0, chars);
		})
		.join("");
}

function abbreviateValue(value: string, level = 0): string {
	if (value.length <= 2) {
		return value;
	}

	if (value.startsWith("[")) {
		const inner = value.slice(1, -1);
		const hashed = `[${hashValue(inner)}]`;
		return hashed.length < value.length ? hashed : value;
	}

	if (value.startsWith("#")) {
		const hashed = `[${hashValue(value)}]`;
		return hashed.length < value.length ? hashed : value;
	}

	if (value.includes("-") || value.includes(".")) {
		return abbreviateSegments(value, level);
	}

	return value.slice(0, 1 + level);
}

function buildMap(
	names: Array<string>,
	abbreviateFn: (name: string, level: number) => string,
	defaults?: Record<string, string>,
): Record<string, string> {
	const sorted = [...names].sort();
	const result: Record<string, string> = {};
	const assigned = new Set<string>();

	if (defaults) {
		for (const name of sorted) {
			const defaultShort = defaults[name];
			if (defaultShort) {
				result[name] = defaultShort;
				assigned.add(defaultShort);
			}
		}
	}

	for (const name of sorted) {
		if (result[name]) {
			continue;
		}

		let level = 0;
		let candidate = abbreviateFn(name, level);

		if (candidate === name) {
			continue;
		}

		while (assigned.has(candidate)) {
			level++;
			const next = abbreviateFn(name, level);
			if (next === candidate || next.length >= name.length) {
				break;
			}
			candidate = next;
		}

		if (!assigned.has(candidate) && candidate !== name) {
			result[name] = candidate;
			assigned.add(candidate);
		}
	}

	return result;
}

export function generateShorteningMap(
	root: Root,
	defaults?: ShorteningMapDefaults,
): ShorteningMap {
	const propertyNames = root.utilities.map((u) => u.name);
	const modifierKeys = root.modifiers.flatMap((m) => m.key);

	const valueKeys = new Set<string>();
	for (const factory of root.utilities) {
		for (const entry of factory.values) {
			valueKeys.add(entry.key);
		}
	}

	const propertyDefaults = defaults?.properties ?? defaultPropertyShortNames;
	const modifierDefaults = defaults?.modifiers ?? defaultModifierShortNames;
	const valueDefaults = defaults?.values;

	return {
		p: buildMap(propertyNames, abbreviateSegments, propertyDefaults),
		v: buildMap([...valueKeys], abbreviateValue, valueDefaults),
		m: buildMap(modifierKeys, abbreviateSegments, modifierDefaults),
	};
}
