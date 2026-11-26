/**
 * Path utilities for DTCG token paths. Paths use dot-notation per the
 * Format Module — group and token names cannot contain `.`.
 */

export function splitPath(path: string): Array<string> {
	if (path.length === 0) {
		return [];
	}
	return path.split(".");
}

export function joinPath(segments: ReadonlyArray<string>): string {
	return segments.join(".");
}

/**
 * Push a child segment onto an existing path. Empty parents stay empty.
 */
export function appendPath(parent: string, child: string): string {
	return parent === "" ? child : `${parent}.${child}`;
}
