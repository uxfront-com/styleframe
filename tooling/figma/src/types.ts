/**
 * Figma color in normalized RGB format (0-1 range)
 */
export interface FigmaRGBA {
	r: number;
	g: number;
	b: number;
	a?: number;
}

/**
 * Figma variable alias reference
 */
export interface FigmaVariableAlias {
	type: "VARIABLE_ALIAS";
	id: string;
}

/**
 * Figma variable resolved types
 */
export type FigmaVariableType = "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";

/**
 * Figma variable value by type
 */
export type FigmaVariableValue =
	| FigmaRGBA
	| number
	| string
	| boolean
	| FigmaVariableAlias;

/**
 * A single variable in the intermediate format
 */
export interface FigmaExportVariable {
	/** Variable name in Figma format (slash notation, e.g., "color/primary") */
	name: string;
	/** Original Styleframe name (dot notation, e.g., "color.primary") */
	styleframeName?: string;
	/** Variable type */
	type: FigmaVariableType;
	/** Values by mode name */
	values: Record<string, FigmaVariableValue>;
	/** If this is a reference/alias, the target variable name */
	aliasTo?: string;
	/** Description/comment for the variable */
	description?: string;
}

/**
 * The intermediate JSON format for Styleframe <-> Figma sync
 */
export interface FigmaExportFormat {
	/** Collection name */
	collection: string;
	/** Mode names (first is default) */
	modes: Array<string>;
	/** Variables in the collection */
	variables: Array<FigmaExportVariable>;
}

/**
 * Options for converting Styleframe to Figma format
 */
export interface StyleframeToFigmaOptions {
	/** Collection name (default: "Design Tokens") */
	collectionName?: string;
	/** Default mode name (default: "Default") */
	defaultModeName?: string;
	/** Base font size for rem conversion (default: 16) */
	baseFontSize?: number;
}

/**
 * Options for converting Figma to Styleframe format
 */
export interface FigmaToStyleframeOptions {
	/** Use composables (useColor, useSpacing, etc.) when possible */
	useComposables?: boolean;
	/** Use rem units for dimensions */
	useRem?: boolean;
	/** Base font size for rem conversion (default: 16) */
	baseFontSize?: number;
	/** Instance variable name (default: "s") */
	instanceName?: string;
	/** Which mode to treat as the default/base (default: first mode) */
	defaultModeName?: string;
}

/**
 * Parsed variable from Figma for code generation
 */
export interface ParsedVariable {
	/** Styleframe name (dot notation) */
	name: string;
	/** Variable value (CSS string or number) */
	value: string | number | boolean;
	/** Variable type category */
	type: "color" | "number" | "string" | "boolean";
	/** First segment of name (e.g., "color" from "color.primary") */
	category: string;
	/** Whether this is a reference to another variable */
	isReference: boolean;
	/** If reference, the target variable name */
	referenceTo?: string;
}

/**
 * Parsed theme from Figma for code generation
 */
export interface ParsedTheme {
	/** Theme name (e.g., "dark") */
	name: string;
	/** Variables with overridden values in this theme */
	variables: Array<ParsedVariable>;
}

/**
 * Result of code generation
 */
export interface CodegenResult {
	/** Generated TypeScript code */
	code: string;
	/** Parsed variables */
	variables: Array<ParsedVariable>;
	/** Parsed themes */
	themes: Array<ParsedTheme>;
	/** Required imports */
	imports: Array<string>;
}
