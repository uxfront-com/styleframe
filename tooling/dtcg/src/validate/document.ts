/**
 * Validate a parsed DTCG document against the spec. Returns an array of
 * `ValidationError` instances — empty when the document is valid.
 *
 * Validation is performed in three passes:
 *
 *   1. Structural: every token has `$value`; every `$type` is recognised;
 *      reserved keys have correct types; extension namespaces are
 *      reverse-DNS.
 *   2. Per-type shape: `$value` matches the expected shape for `$type`,
 *      after applying inheritance.
 *   3. Reference integrity: every alias points to a defined token of a
 *      compatible type.
 */

import { isAlias } from "../guards/alias";
import { isToken } from "../guards/token";
import {
	isBorderValue,
	isColorValue,
	isCubicBezierValue,
	isDimensionValue,
	isDurationValue,
	isFontFamilyValue,
	isFontWeightValue,
	isGradientValue,
	isNumberValue,
	isShadowValue,
	isStrokeStyleValue,
	isTransitionValue,
	isTypographyValue,
} from "../guards/values";
import { applyInheritance } from "../inheritance/apply";
import { walk } from "../parse/walk";
import { ValidationError } from "../parse/errors";
import { isValidNamespace } from "../extensions/namespace";
import { lookupToken } from "../alias/lookup";
import { parseAlias } from "../alias/parse";
import type { DTCGAnyToken, DTCGDocument } from "../types/token";
import type { DTCGTokenType } from "../types/values";

const KNOWN_TYPES: ReadonlySet<DTCGTokenType> = new Set<DTCGTokenType>([
	"color",
	"dimension",
	"fontFamily",
	"fontWeight",
	"duration",
	"cubicBezier",
	"number",
	"border",
	"strokeStyle",
	"transition",
	"shadow",
	"gradient",
	"typography",
]);

const VALUE_GUARDS: Record<DTCGTokenType, (v: unknown) => boolean> = {
	color: isColorValue,
	dimension: isDimensionValue,
	fontFamily: isFontFamilyValue,
	fontWeight: isFontWeightValue,
	duration: isDurationValue,
	cubicBezier: isCubicBezierValue,
	number: isNumberValue,
	border: isBorderValue,
	strokeStyle: isStrokeStyleValue,
	transition: isTransitionValue,
	shadow: isShadowValue,
	gradient: isGradientValue,
	typography: isTypographyValue,
};

function validateExtensions(
	extensions: unknown,
	path: string,
	errors: Array<ValidationError>,
): void {
	if (extensions === undefined) {
		return;
	}
	if (
		typeof extensions !== "object" ||
		extensions === null ||
		Array.isArray(extensions)
	) {
		errors.push(
			new ValidationError(
				"$extensions must be an object",
				path,
				"object",
				extensions,
			),
		);
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

function validateMetadataTypes(
	node: Record<string, unknown>,
	path: string,
	errors: Array<ValidationError>,
): void {
	if (
		node.$description !== undefined &&
		typeof node.$description !== "string"
	) {
		errors.push(
			new ValidationError(
				"$description must be a string",
				path,
				"string",
				node.$description,
			),
		);
	}
	if (node.$deprecated !== undefined) {
		const v = node.$deprecated;
		if (typeof v !== "boolean" && typeof v !== "string") {
			errors.push(
				new ValidationError(
					"$deprecated must be a boolean or string",
					path,
					"boolean | string",
					v,
				),
			);
		}
	}
	if (
		node.$type !== undefined &&
		(typeof node.$type !== "string" ||
			!KNOWN_TYPES.has(node.$type as DTCGTokenType))
	) {
		errors.push(
			new ValidationError(
				`$type "${String(node.$type)}" is not a recognised DTCG type`,
				path,
				`one of: ${[...KNOWN_TYPES].join(", ")}`,
				node.$type,
			),
		);
	}
	validateExtensions(node.$extensions, path, errors);
}

function validateTokenValue(
	token: DTCGAnyToken,
	path: string,
	doc: DTCGDocument,
	errors: Array<ValidationError>,
): void {
	if (isAlias(token.$value)) {
		const target = parseAlias(token.$value);
		const resolved = lookupToken(doc, target);
		if (!resolved) {
			errors.push(
				new ValidationError(
					`Alias "${token.$value}" does not resolve to any token`,
					path,
					"a defined token",
					target,
				),
			);
			return;
		}
		if (token.$type && resolved.$type && token.$type !== resolved.$type) {
			errors.push(
				new ValidationError(
					`Alias type mismatch: expected ${token.$type} but target is ${resolved.$type}`,
					path,
					token.$type,
					resolved.$type,
				),
			);
		}
		return;
	}
	if (!token.$type) {
		errors.push(
			new ValidationError(
				"Token has no $type and no inheritable type from a parent group",
				path,
				"$type or inherited $type",
			),
		);
		return;
	}
	const guard = VALUE_GUARDS[token.$type];
	if (!guard) {
		// Unknown $type — already reported in validateMetadataTypes; skip value check.
		return;
	}
	if (!guard(token.$value)) {
		errors.push(
			new ValidationError(
				`$value does not match the expected shape for $type "${token.$type}"`,
				path,
				token.$type,
				token.$value,
			),
		);
	}
}

function validateTree(
	node: Record<string, unknown>,
	currentPath: string,
	doc: DTCGDocument,
	errors: Array<ValidationError>,
): void {
	validateMetadataTypes(node, currentPath, errors);
	if (isToken(node)) {
		validateTokenValue(node, currentPath, doc, errors);
		return;
	}
	// `$root` is a spec-reserved token that lives inside a group. Validate
	// it like any leaf token at the parent's path.
	const rootToken = node.$root;
	if (
		rootToken !== undefined &&
		typeof rootToken === "object" &&
		rootToken !== null &&
		!Array.isArray(rootToken) &&
		"$value" in (rootToken as object)
	) {
		validateTokenValue(rootToken as DTCGAnyToken, currentPath, doc, errors);
	}
	for (const [key, child] of Object.entries(node)) {
		if (key.startsWith("$")) {
			continue;
		}
		if (key.includes("{") || key.includes("}") || key.includes(".")) {
			errors.push(
				new ValidationError(
					`Group/token name "${key}" contains a reserved character (one of "{", "}", ".")`,
					currentPath,
					"name without {, }, or .",
					key,
				),
			);
		}
		if (child !== null && typeof child === "object" && !Array.isArray(child)) {
			validateTree(
				child as Record<string, unknown>,
				currentPath === "" ? key : `${currentPath}.${key}`,
				doc,
				errors,
			);
		}
	}
}

export function validate(doc: DTCGDocument): Array<ValidationError> {
	const errors: Array<ValidationError> = [];
	const inherited = applyInheritance(doc);
	validateTree(
		inherited as unknown as Record<string, unknown>,
		"",
		inherited,
		errors,
	);
	// Walk again on the inherited copy to catch reference-integrity errors per token.
	for (const _entry of walk(inherited)) {
		// validation already covers per-token in validateTree; walk is here in case
		// future cross-cutting checks need the full token list.
		void _entry;
	}
	return errors;
}
