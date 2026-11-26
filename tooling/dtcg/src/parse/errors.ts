/**
 * Typed error classes used across the package. All carry a `path` (dot-
 * notation, empty for the document root) and a structured shape so callers
 * can format messages or surface errors in IDE tooling.
 */

export class ParseError extends Error {
	constructor(
		message: string,
		public readonly path = "",
	) {
		super(message);
		this.name = "ParseError";
	}
}

export class ValidationError extends Error {
	constructor(
		message: string,
		public readonly path: string,
		public readonly expected?: string,
		public readonly received?: unknown,
	) {
		super(message);
		this.name = "ValidationError";
	}
}

export class CircularReferenceError extends Error {
	constructor(public readonly cycle: Array<string>) {
		super(`Circular alias reference: ${cycle.join(" → ")}`);
		this.name = "CircularReferenceError";
	}
}

export class UnknownReferenceError extends Error {
	constructor(
		public readonly path: string,
		public readonly target: string,
	) {
		super(`Unknown alias target "${target}" referenced from "${path}"`);
		this.name = "UnknownReferenceError";
	}
}
