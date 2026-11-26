import { UTILITY_CLASS_PATTERN } from "@styleframe/scanner";

export function transformSourceClassNames(
	code: string,
	lookup: Record<string, string>,
): { code: string; changed: boolean } {
	let changed = false;

	const transformed = code.replaceAll(
		new RegExp(UTILITY_CLASS_PATTERN.source, "g"),
		(match) => {
			const replacement = lookup[match];
			if (replacement) {
				changed = true;
				return replacement;
			}
			return match;
		},
	);

	return { code: transformed, changed };
}
