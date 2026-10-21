import { defaultUtilitySelectorFn } from "../defaults";
import type { Styleframe } from "../styleframe";
import { isCSS, isRef } from "../typeGuards";
import type {
	StyleframeOptions,
	ThemeSelectorFn,
	TokenValue,
	VariableNameFn,
} from "../types";
import type { InspectSnapshot } from "./types";

// The transpiler's defaults, which core can't import
const defaultVariableNameFn: VariableNameFn = ({ name }) =>
	name.replace(/^\.+|\.+$/g, "").replace(/\.+/g, "--");

const defaultThemeSelectorFn: ThemeSelectorFn = ({ name }) =>
	`.${name}-theme, [data-theme="${name}"]`;

/**
 * Returns a JSON-serialisable snapshot of what an instance defines: its root
 * variables, themes, utilities, modifiers, and recipes, with names and values
 * as the CSS output emits them.
 */
export function inspect(instance: Styleframe): InspectSnapshot {
	const { root, options } = instance;
	const themeSelectorFn = options.themes?.selector ?? defaultThemeSelectorFn;
	const utilitySelectorFn =
		options.utilities?.selector ?? defaultUtilitySelectorFn;

	return {
		variables: root.variables.map((variable) => ({
			name: variable.name,
			property: toProperty(variable.name, options),
			value: toValue(variable.value, options),
		})),
		themes: root.themes.map((theme) => ({
			name: theme.name,
			selector: themeSelectorFn({ name: theme.name }),
			overrides: theme.variables.map((variable) => ({
				name: variable.name,
				value: toValue(variable.value, options),
			})),
		})),
		utilities: root.utilities.map((utility) => ({
			name: utility.name,
			values: [
				...new Set(
					utility.values
						.filter((entry) => entry.modifiers.length === 0)
						.map((entry) => entry.key),
				),
			],
			classNames: utility.values.map((entry) =>
				utilitySelectorFn({
					name: utility.name,
					value: entry.key,
					modifiers: entry.modifiers,
				}),
			),
			modifiers: [
				...new Set(utility.values.flatMap((entry) => entry.modifiers)),
			],
		})),
		modifiers: root.modifiers.map((modifier) => ({ key: [...modifier.key] })),
		recipes: root.recipes.map((recipe) => ({
			name: recipe.name,
			variants: Object.fromEntries(
				Object.entries(recipe.variants ?? {}).map(([axis, options]) => [
					axis,
					Object.keys(options),
				]),
			),
			defaultVariants: Object.fromEntries(
				Object.entries(recipe.defaultVariants ?? {})
					.filter(([, option]) => option !== undefined && option !== null)
					.map(([axis, option]) => [axis, String(option)]),
			),
		})),
	};
}

function toProperty(name: string, options: StyleframeOptions): string {
	const variableNameFn = options.variables?.name ?? defaultVariableNameFn;
	const emitted = variableNameFn({ name });
	const normalized = emitted.startsWith("--") ? emitted.slice(2) : emitted;
	const safe = normalized.replace(/[^a-zA-Z0-9_\-\u0080-\uFFFF]/g, "-");

	return `--${safe || "unknown-variable"}`;
}

function toValue(value: TokenValue, options: StyleframeOptions): string {
	if (isRef(value)) {
		const fallback = value.fallback ? toValue(value.fallback, options) : "";
		return `var(${toProperty(value.name, options)}${fallback ? `, ${fallback}` : ""})`;
	}

	if (isCSS(value)) {
		return value.value
			.map((part) => toValue(part, options))
			.join("")
			.trim();
	}

	if (Array.isArray(value)) {
		return value.map((part) => toValue(part, options)).join(",");
	}

	return value !== undefined && value !== null ? `${value}` : "";
}
