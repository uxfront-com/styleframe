import type { Styleframe, UtilityFactory } from "@styleframe/core";
import {
	extractClasses,
	generateUtilityClassName,
	matchUtilities,
	parseUtilityClass,
	registerMatchedUtilities,
} from "@styleframe/scanner";
import type { ParsedUtility } from "@styleframe/scanner";

export interface ScanSource {
	content: string;
	filePath: string;
}

export interface ScanDiagnostic {
	raw: string;
	name: string;
	value: string;
	modifiers: Array<string>;
	factoryFound: boolean;
	alreadyExisted: boolean;
}

export interface ScanResult {
	count: number;
	registered: Array<string>;
	diagnostics: Array<ScanDiagnostic>;
}

function valueKeyTuple(factoryName: string, key: string, modifiers: Array<string>): string {
	const sorted = [...modifiers].sort().join(",");
	return `${factoryName}::${key}::${sorted}`;
}

function snapshotValues(utilities: Array<UtilityFactory>): Set<string> {
	const set = new Set<string>();
	for (const factory of utilities) {
		for (const v of factory.values) {
			set.add(valueKeyTuple(factory.name, v.key, v.modifiers));
		}
	}
	return set;
}

export function scanAndRegisterUtilities(
	instance: Styleframe,
	sources: Array<ScanSource>,
): ScanResult {
	const parsed: Array<ParsedUtility> = [];

	for (const { content, filePath } of sources) {
		const classNames = extractClasses(content, filePath);
		for (const className of classNames) {
			const p = parseUtilityClass(className);
			if (p !== null) {
				parsed.push(p);
			}
		}
	}

	if (parsed.length === 0) {
		return { count: 0, registered: [], diagnostics: [] };
	}

	const matches = matchUtilities(parsed, instance.root);

	const diagnostics: Array<ScanDiagnostic> = matches.map((m) => ({
		raw: m.parsed.raw,
		name: m.parsed.name,
		value: m.parsed.value,
		modifiers: m.parsed.modifiers,
		factoryFound: m.factory !== null,
		alreadyExisted: m.exists,
	}));

	const before = snapshotValues(instance.root.utilities);
	const count = registerMatchedUtilities(instance.root, matches);
	const after = snapshotValues(instance.root.utilities);

	const registered: Array<string> = [];
	const seen = new Set<string>();
	for (const match of matches) {
		if (match.factory === null || match.exists) {
			continue;
		}
		const tuple = valueKeyTuple(match.parsed.name, match.parsed.value, match.parsed.modifiers);
		if (seen.has(tuple)) {
			continue;
		}
		if (after.has(tuple) && !before.has(tuple)) {
			seen.add(tuple);
			registered.push(
				generateUtilityClassName(match.parsed.name, match.parsed.value, match.parsed.modifiers),
			);
		}
	}

	return { count, registered, diagnostics };
}
