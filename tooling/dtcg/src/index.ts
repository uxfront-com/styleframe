/**
 * @styleframe/dtcg — public API.
 *
 * Spec-conformant parser, validator, and serializer for the W3C Design
 * Tokens Community Group format (Format, Color, and Resolver modules,
 * 2025.10).
 */

// All types
export type * from "./types";

// Parsing + iteration + errors
export { parse, walk } from "./parse";
export type { WalkEntry } from "./parse";
export {
	CircularReferenceError,
	ParseError,
	UnknownReferenceError,
	ValidationError,
} from "./parse/errors";

// Validation
export { validate, validateResolver } from "./validate";

// Type guards
export {
	isAlias,
	isBorderValue,
	isColorSpace,
	isColorValue,
	isCubicBezierValue,
	isDimensionValue,
	isDocument,
	isDurationValue,
	isFontFamilyValue,
	isFontWeightValue,
	isGradientStop,
	isGradientValue,
	isGroup,
	isNumberValue,
	isShadowLayer,
	isShadowValue,
	isStrokeStyleObject,
	isStrokeStyleValue,
	isToken,
	isTransitionValue,
	isTypographyValue,
} from "./guards";

// Aliases
export {
	appendPath,
	formatAlias,
	joinPath,
	lookupToken,
	parseAlias,
	resolveAliases,
	splitPath,
} from "./alias";

// Inheritance
export { applyInheritance } from "./inheritance";

// Classification (value + path → DTCG type)
export type { Classification, ClassifyOptions } from "./classify";
export {
	CUBIC_BEZIER_PATTERN,
	classifyValue,
	easingKeywordToBezier,
	isEasingKeyword,
	parseCubicBezier,
} from "./classify";

// Per-type value helpers
export * as color from "./color";
export * as composite from "./composite";
export * as dimension from "./dimension";
export * as duration from "./duration";

// Extensions
export { isValidNamespace } from "./extensions";

// Resolver
export { mergeDocuments, parseResolver, resolve as resolveResolver } from "./resolver";
