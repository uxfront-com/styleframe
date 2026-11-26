import type {
	FigmaExportFormat,
	FigmaToStyleframeOptions,
	ParsedVariable,
	ParsedTheme,
	CodegenResult,
	FigmaVariableValue,
	FigmaRGBA,
} from "../types";
import {
	figmaToStyleframeName,
	toVariableIdentifier,
	extractCategory,
} from "./name-mapping";
import { figmaValueToStyleframe } from "./value-parsing";

/**
 * Known composable categories and their function names
 */
const COMPOSABLE_MAP: Record<string, string> = {
	color: "useColorDesignTokens",
	spacing: "useSpacingDesignTokens",
	fontSize: "useFontSizeDesignTokens",
	fontWeight: "useFontWeightDesignTokens",
	fontFamily: "useFontFamilyDesignTokens",
	lineHeight: "useLineHeightDesignTokens",
	letterSpacing: "useLetterSpacingDesignTokens",
	borderWidth: "useBorderWidthDesignTokens",
	borderRadius: "useBorderRadiusDesignTokens",
	boxShadow: "useBoxShadowDesignTokens",
};

/**
 * Check if a value is a Figma variable alias
 */
function isVariableAlias(
	value: FigmaVariableValue,
): value is { type: "VARIABLE_ALIAS"; id: string } {
	return (
		typeof value === "object" &&
		value !== null &&
		"type" in value &&
		value.type === "VARIABLE_ALIAS"
	);
}

/**
 * Check if a value is a Figma RGBA color
 */
function isFigmaColor(value: FigmaVariableValue): value is FigmaRGBA {
	return (
		typeof value === "object" &&
		value !== null &&
		"r" in value &&
		"g" in value &&
		"b" in value
	);
}

/**
 * Parse Figma export format into structured data for code generation
 */
function parseVariables(
	data: FigmaExportFormat,
	options: FigmaToStyleframeOptions,
): { variables: Array<ParsedVariable>; themes: Array<ParsedTheme> } {
	const { useRem = false, baseFontSize = 16, defaultModeName } = options;

	const defaultMode = defaultModeName || data.modes[0] || "Default";
	const themeNames = data.modes.filter((m) => m !== defaultMode);

	// Build a map of variable ID to name for alias resolution
	const nameMap = new Map<string, string>();
	for (const v of data.variables) {
		nameMap.set(v.name, figmaToStyleframeName(v.name));
	}

	const variables: Array<ParsedVariable> = [];
	const themeVariablesMap = new Map<string, Array<ParsedVariable>>();

	for (const themeName of themeNames) {
		themeVariablesMap.set(themeName, []);
	}

	for (const variable of data.variables) {
		const styleframeName = figmaToStyleframeName(variable.name);
		const category = extractCategory(styleframeName);
		const defaultValue = variable.values[defaultMode];

		if (defaultValue === undefined) {
			continue;
		}

		// Determine type
		let type: ParsedVariable["type"] = "string";
		if (variable.type === "COLOR") {
			type = "color";
		} else if (variable.type === "FLOAT") {
			type = "number";
		} else if (variable.type === "BOOLEAN") {
			type = "boolean";
		}

		// Check if it's a reference
		const isReference = isVariableAlias(defaultValue);
		let referenceTo: string | undefined;
		let value: string | number | boolean;

		if (isReference) {
			// For aliases, we need to find the target variable name
			referenceTo = variable.aliasTo
				? figmaToStyleframeName(variable.aliasTo)
				: undefined;
			value = ""; // Will be rendered as ref()
		} else if (isFigmaColor(defaultValue)) {
			value = figmaValueToStyleframe(
				defaultValue,
				"COLOR",
				useRem,
				baseFontSize,
			) as string;
		} else if (typeof defaultValue === "number") {
			value = figmaValueToStyleframe(
				defaultValue,
				"FLOAT",
				useRem,
				baseFontSize,
			) as string;
		} else if (typeof defaultValue === "boolean") {
			value = defaultValue;
		} else {
			value = String(defaultValue);
		}

		variables.push({
			name: styleframeName,
			value,
			type,
			category,
			isReference,
			referenceTo,
		});

		// Process theme overrides
		for (const themeName of themeNames) {
			const themeValue = variable.values[themeName];
			if (themeValue === undefined) {
				continue;
			}

			// Check if the value differs from default
			const isThemeReference = isVariableAlias(themeValue);
			let themeStyleframeValue: string | number | boolean;

			if (isThemeReference) {
				continue; // Skip theme references for now
			} else if (isFigmaColor(themeValue)) {
				themeStyleframeValue = figmaValueToStyleframe(
					themeValue,
					"COLOR",
					useRem,
					baseFontSize,
				) as string;
			} else if (typeof themeValue === "number") {
				themeStyleframeValue = figmaValueToStyleframe(
					themeValue,
					"FLOAT",
					useRem,
					baseFontSize,
				) as string;
			} else if (typeof themeValue === "boolean") {
				themeStyleframeValue = themeValue;
			} else {
				themeStyleframeValue = String(themeValue);
			}

			// Only add if different from default
			if (themeStyleframeValue !== value) {
				const themeVariables = themeVariablesMap.get(themeName) || [];
				themeVariables.push({
					name: styleframeName,
					value: themeStyleframeValue,
					type,
					category,
					isReference: false,
				});
				themeVariablesMap.set(themeName, themeVariables);
			}
		}
	}

	const themes: Array<ParsedTheme> = [];
	for (const [name, vars] of themeVariablesMap) {
		if (vars.length > 0) {
			themes.push({ name: name.toLowerCase(), variables: vars });
		}
	}

	return { variables, themes };
}

/**
 * Group variables by category
 */
function groupByCategory(
	variables: Array<ParsedVariable>,
): Map<string, Array<ParsedVariable>> {
	const groups = new Map<string, Array<ParsedVariable>>();
	for (const v of variables) {
		const existing = groups.get(v.category) || [];
		existing.push(v);
		groups.set(v.category, existing);
	}
	return groups;
}

/**
 * Generate code using composables
 */
function generateComposableCode(
	category: string,
	variables: Array<ParsedVariable>,
	instanceName: string,
): { code: string; identifiers: Array<string>; composable: string } | null {
	const composableName = COMPOSABLE_MAP[category];
	if (!composableName) {
		return null;
	}

	// Filter out references - composables don't handle them
	const nonRefVars = variables.filter((v) => !v.isReference);
	if (nonRefVars.length === 0) {
		return null;
	}

	const identifiers: Array<string> = [];
	const valueEntries: Array<string> = [];

	for (const v of nonRefVars) {
		const key = v.name.split(".").slice(1).join(".") || v.name;
		const identifier = toVariableIdentifier(v.name);
		identifiers.push(identifier);

		const valueStr =
			typeof v.value === "string" ? `"${v.value}"` : String(v.value);
		valueEntries.push(`\t${key}: ${valueStr},`);
	}

	const destructure = identifiers.join(", ");
	const code = `const { ${destructure} } = ${composableName}(${instanceName}, {\n${valueEntries.join("\n")}\n});`;

	return { code, identifiers, composable: composableName };
}

/**
 * Generate variable declaration code
 * Returns null if the variable cannot be generated (e.g., reference with unknown target)
 */
function generateVariableCode(variable: ParsedVariable): string | null {
	const identifier = toVariableIdentifier(variable.name);

	if (variable.isReference) {
		if (variable.referenceTo) {
			const refTarget = toVariableIdentifier(variable.referenceTo);
			return `const ${identifier} = variable("${variable.name}", ref(${refTarget}));`;
		}
		// Skip references with unknown targets - they can't be properly generated
		return null;
	}

	const valueStr =
		typeof variable.value === "string"
			? `"${variable.value}"`
			: String(variable.value);
	return `const ${identifier} = variable("${variable.name}", ${valueStr});`;
}

/**
 * Generate theme block code
 */
function generateThemeCode(theme: ParsedTheme, instanceName: string): string {
	const lines: Array<string> = [];
	lines.push(`theme("${theme.name}", (ctx) => {`);

	for (const v of theme.variables) {
		const identifier = toVariableIdentifier(v.name);
		const valueStr =
			typeof v.value === "string" ? `"${v.value}"` : String(v.value);
		lines.push(`\tctx.variable(${identifier}, ${valueStr});`);
	}

	lines.push("});");
	return lines.join("\n");
}

/**
 * Generate Styleframe TypeScript code from Figma export format
 */
export function generateStyleframeCode(
	data: FigmaExportFormat,
	options: FigmaToStyleframeOptions = {},
): CodegenResult {
	const { useComposables = true, instanceName = "s" } = options;

	const { variables, themes } = parseVariables(data, options);
	const grouped = groupByCategory(variables);
	const imports: Array<string> = ["styleframe"];
	const usedComposables = new Set<string>();
	const lines: Array<string> = [];

	// Generate variable declarations
	const generatedIdentifiers = new Set<string>();

	for (const [category, vars] of grouped) {
		lines.push(
			`\n// ${category.charAt(0).toUpperCase() + category.slice(1)} variables`,
		);

		if (useComposables) {
			const composableResult = generateComposableCode(
				category,
				vars,
				instanceName,
			);
			if (composableResult) {
				lines.push(composableResult.code);
				usedComposables.add(composableResult.composable);
				for (const id of composableResult.identifiers) {
					generatedIdentifiers.add(id);
				}
			}
		}

		// Generate remaining variables (references or non-composable)
		for (const v of vars) {
			const identifier = toVariableIdentifier(v.name);
			if (generatedIdentifiers.has(identifier)) {
				continue;
			}

			if (!useComposables || v.isReference || !COMPOSABLE_MAP[category]) {
				const code = generateVariableCode(v);
				if (code) {
					lines.push(code);
					generatedIdentifiers.add(identifier);
				}
			}
		}
	}

	// Generate theme blocks
	if (themes.length > 0) {
		lines.push("");
		for (const theme of themes) {
			lines.push(generateThemeCode(theme, instanceName));
		}
	}

	// Build final code
	const composableImports = Array.from(usedComposables).sort();

	let code = `import { styleframe } from "styleframe";\n`;
	if (composableImports.length > 0) {
		code += `import { ${composableImports.join(", ")} } from "@styleframe/theme";\n`;
		imports.push(...composableImports);
	}

	code += `\nconst ${instanceName} = styleframe();\n`;
	code += `const { variable, ref, theme } = ${instanceName};\n`;
	code += lines.join("\n");
	code += `\n\nexport default ${instanceName};\n`;

	return {
		code,
		variables,
		themes,
		imports,
	};
}
