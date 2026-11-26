export type RangeInput<T> = [min: T, max: T] | { min: T; max: T };

export function normalizeRange<T>(range: RangeInput<T>): [T, T] {
	return Array.isArray(range) ? range : [range.min, range.max];
}

export function isRangeInput<T>(value: unknown): value is RangeInput<T> {
	if (Array.isArray(value)) {
		return value.length === 2;
	}

	if (typeof value === "object" && value !== null) {
		return "min" in value && "max" in value && Object.keys(value as object).length === 2;
	}

	return false;
}
