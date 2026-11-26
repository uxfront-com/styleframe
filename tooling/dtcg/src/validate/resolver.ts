/**
 * Validate a parsed Resolver Module document. Returns an array of
 * `ValidationError`s — empty when valid.
 */

import { isValidNamespace } from "../extensions/namespace";
import { ValidationError } from "../parse/errors";
import type {
	DTCGModifier,
	DTCGRef,
	DTCGResolverDocument,
	DTCGSet,
} from "../types/resolver";

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRef(value: unknown): value is DTCGRef {
	return isPlainObject(value) && typeof value.$ref === "string";
}

function validateExtensions(
	extensions: unknown,
	path: string,
	errors: Array<ValidationError>,
): void {
	if (extensions === undefined) {
		return;
	}
	if (!isPlainObject(extensions)) {
		errors.push(new ValidationError("$extensions must be an object", path));
		return;
	}
	for (const key of Object.keys(extensions)) {
		if (!isValidNamespace(key)) {
			errors.push(
				new ValidationError(
					`Extension namespace "${key}" is not reverse-DNS`,
					path,
					"reverse-DNS namespace",
					key,
				),
			);
		}
	}
}

function validateSources(
	sources: unknown,
	path: string,
	errors: Array<ValidationError>,
): void {
	if (!Array.isArray(sources)) {
		errors.push(
			new ValidationError("sources must be an array", path, "array", sources),
		);
		return;
	}
	if (sources.length === 0) {
		errors.push(
			new ValidationError("sources must not be empty", path, "non-empty array"),
		);
	}
	sources.forEach((s, i) => {
		if (!isRef(s) && !isPlainObject(s)) {
			errors.push(
				new ValidationError(
					"sources entry must be a $ref or an inline object",
					`${path}[${i}]`,
					"$ref | object",
					s,
				),
			);
		}
	});
}

function validateSet(
	set: DTCGSet,
	path: string,
	errors: Array<ValidationError>,
): void {
	validateSources(set.sources, `${path}.sources`, errors);
	validateExtensions(set.$extensions, `${path}.$extensions`, errors);
	if (set.description !== undefined && typeof set.description !== "string") {
		errors.push(
			new ValidationError(
				"description must be a string",
				`${path}.description`,
			),
		);
	}
}

function validateModifier(
	modifier: DTCGModifier,
	path: string,
	errors: Array<ValidationError>,
): void {
	if (!isPlainObject(modifier.contexts)) {
		errors.push(
			new ValidationError("contexts must be an object", `${path}.contexts`),
		);
		return;
	}
	const contextNames = Object.keys(modifier.contexts);
	if (contextNames.length === 0) {
		errors.push(
			new ValidationError(
				"contexts must define at least one context",
				`${path}.contexts`,
			),
		);
	}
	for (const [name, sources] of Object.entries(modifier.contexts)) {
		validateSources(sources, `${path}.contexts.${name}`, errors);
	}
	if (modifier.default !== undefined) {
		if (typeof modifier.default !== "string") {
			errors.push(
				new ValidationError("default must be a string", `${path}.default`),
			);
		} else if (!contextNames.includes(modifier.default)) {
			errors.push(
				new ValidationError(
					`default "${modifier.default}" is not a defined context`,
					`${path}.default`,
					contextNames.join(" | "),
					modifier.default,
				),
			);
		}
	}
	validateExtensions(modifier.$extensions, `${path}.$extensions`, errors);
}

export function validateResolver(
	doc: DTCGResolverDocument,
): Array<ValidationError> {
	const errors: Array<ValidationError> = [];

	if (doc.version !== "2025.10") {
		errors.push(
			new ValidationError(
				`Resolver version must be exactly "2025.10"`,
				"version",
				"2025.10",
				doc.version,
			),
		);
	}

	if (doc.sets !== undefined) {
		if (!isPlainObject(doc.sets)) {
			errors.push(new ValidationError("sets must be an object", "sets"));
		} else {
			for (const [name, set] of Object.entries(doc.sets)) {
				validateSet(set as DTCGSet, `sets.${name}`, errors);
			}
		}
	}

	if (doc.modifiers !== undefined) {
		if (!isPlainObject(doc.modifiers)) {
			errors.push(
				new ValidationError("modifiers must be an object", "modifiers"),
			);
		} else {
			for (const [name, modifier] of Object.entries(doc.modifiers)) {
				validateModifier(modifier as DTCGModifier, `modifiers.${name}`, errors);
			}
		}
	}

	if (!Array.isArray(doc.resolutionOrder)) {
		errors.push(
			new ValidationError(
				"resolutionOrder must be an array",
				"resolutionOrder",
				"array",
				doc.resolutionOrder,
			),
		);
	} else if (doc.resolutionOrder.length === 0) {
		errors.push(
			new ValidationError(
				"resolutionOrder must not be empty",
				"resolutionOrder",
			),
		);
	} else {
		doc.resolutionOrder.forEach((item, i) => {
			if (isRef(item)) {
				return;
			}
			if (!isPlainObject(item)) {
				errors.push(
					new ValidationError(
						"resolutionOrder entry must be a $ref or inline set/modifier",
						`resolutionOrder[${i}]`,
					),
				);
				return;
			}
			const type = (item as Record<string, unknown>).type;
			if (type !== "set" && type !== "modifier") {
				errors.push(
					new ValidationError(
						`Inline resolutionOrder entry must declare type: "set" or "modifier"`,
						`resolutionOrder[${i}].type`,
						"set | modifier",
						type,
					),
				);
			}
		});
	}

	validateExtensions(doc.$extensions, "$extensions", errors);

	return errors;
}
