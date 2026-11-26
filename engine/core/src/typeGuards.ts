import type { Styleframe } from "./styleframe";
import type {
	AtRule,
	Container,
	ContainerInput,
	CSS,
	ModifierFactory,
	PrimitiveTokenValue,
	Recipe,
	Reference,
	Root,
	Selector,
	Theme,
	TokenType,
	TokenValue,
	Utility,
	Variable,
} from "./types";

export function isObject(value: unknown): value is object {
	return typeof value === "object" && value !== null;
}

/**
 * Tokens
 */

export function isToken<T>(value: unknown, type: TokenType): value is T {
	return isObject(value) && "type" in value && value.type === type;
}

export function isVariable<Name extends string = string>(value: unknown): value is Variable<Name> {
	return isToken(value, "variable");
}

export function isRef<Name extends string = string>(value: unknown): value is Reference<Name> {
	return isToken(value, "reference");
}

export function isSelector(value: unknown): value is Selector {
	return isToken(value, "selector");
}

export function isAtRule(value: unknown): value is AtRule {
	return isToken(value, "at-rule");
}

export function isUtility<Name extends string = string>(value: unknown): value is Utility<Name> {
	return isToken(value, "utility");
}

export function isModifier(value: unknown): value is ModifierFactory {
	return isToken(value, "modifier");
}

export function isCSS(value: unknown): value is CSS {
	return isToken(value, "css");
}

export function isTheme(value: unknown): value is Theme {
	return isToken(value, "theme");
}

export function isRoot(value: unknown): value is Root {
	return isToken(value, "root");
}

export function isRecipe(value: unknown): value is Recipe {
	return isToken(value, "recipe");
}

export function isPrimitiveTokenValue(value: unknown): value is PrimitiveTokenValue {
	return (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean" ||
		value === null
	);
}

export function isTokenValue(value: unknown): value is TokenValue {
	return (
		isPrimitiveTokenValue(value) ||
		isRef(value) ||
		isCSS(value) ||
		(Array.isArray(value) && value.every(isTokenValue))
	);
}

export function isContainer(value: unknown): value is Container {
	return (
		isObject(value) &&
		"id" in value &&
		"children" in value &&
		"declarations" in value &&
		"variables" in value
	);
}

export function isContainerInput(value: unknown): value is ContainerInput {
	return isObject(value) && "children" in value && "declarations" in value && "variables" in value;
}

export function isKeyReferenceValue(value: unknown): value is `@${string}` {
	return typeof value === "string" && value.startsWith("@");
}

export function isStyleframe(value: unknown): value is Styleframe {
	return (
		isObject(value) &&
		"id" in value &&
		"root" in value &&
		"variable" in value &&
		"selector" in value &&
		"recipe" in value &&
		typeof (value as Styleframe).id === "string" &&
		isRoot((value as Styleframe).root)
	);
}
