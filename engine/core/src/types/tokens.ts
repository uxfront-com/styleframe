import type {
	DeclarationsBlock,
	DeclarationsCallback,
	DeclarationsCallbackContext,
} from "./declarations";

export type Variable<Name extends string = string> = {
	type: "variable";
	id: string;
	parentId?: string;
	name: Name;
	value: TokenValue;
};

export type Reference<Name extends string = string> = {
	type: "reference";
	name: Name;
	fallback?: TokenValue;
};

export type Selector = {
	type: "selector";
	id: string;
	parentId?: string;
	query: string;
	declarations: DeclarationsBlock;
	variables: Variable[];
	children: ContainerChild[];
	_exportName?: string;
};

export type AtRule = {
	type: "at-rule";
	id: string;
	parentId?: string;
	identifier: string;
	rule: string;
	declarations: DeclarationsBlock;
	variables: Variable[];
	children: ContainerChild[];
};

export type CSS = {
	type: "css";
	value: TokenValue[];
};

export type UtilityAutogenerateFn = (
	value: TokenValue,
) => Record<string, TokenValue>;

export type UtilityFactory<Name extends string = string> = {
	type: "utility";
	name: Name;
	factory: UtilityCallbackFn;
	values: Array<{ key: string; value: TokenValue; modifiers: string[] }>;
	autogenerate: UtilityAutogenerateFn;
	namespace?: string | string[];
	create: UtilityCreatorFn;
};

export type Utility<Name extends string = string> = {
	type: "utility";
	id: string;
	parentId?: string;
	name: Name;
	value: string;
	declarations: DeclarationsBlock;
	variables: Variable[];
	children: ContainerChild[];
	modifiers: string[];
};

export type UtilityCallbackFn = DeclarationsCallback<
	DeclarationsCallbackContext & {
		value: TokenValue;
	}
>;

export type UtilityCreatorFn = (
	values: Record<string, TokenValue> | TokenValue[],
	modifiers?: (ModifierFactory | ModifierFactory[])[],
) => void;

export type ModifierCallbackFn = DeclarationsCallback<
	DeclarationsCallbackContext &
		Pick<Utility, "declarations" | "variables" | "children">
>;

export type ModifierFactory = {
	type: "modifier";
	key: string[];
	factory: ModifierCallbackFn;
};

export type ModifierDeclarationsBlock = Record<string, TokenValue>;

export type VariantDeclarationsValue = TokenValue | ModifierDeclarationsBlock;

export type VariantDeclarationsBlock = Record<string, VariantDeclarationsValue>;

export type VariantsBase = Record<
	string,
	Record<string, VariantDeclarationsBlock>
>;

export type RuntimeModifierDeclarationsBlock = Record<
	string,
	PrimitiveTokenValue
>;

export type RuntimeVariantDeclarationsValue =
	| PrimitiveTokenValue
	| RuntimeModifierDeclarationsBlock;

export type RuntimeVariantDeclarationsBlock = Record<
	string,
	RuntimeVariantDeclarationsValue
>;

export type RecipeRuntime<Variants extends VariantsBase = VariantsBase> = {
	base?: RuntimeVariantDeclarationsBlock;
	variants?: {
		[K in keyof Variants]?: {
			[O in keyof Variants[K]]?: RuntimeVariantDeclarationsBlock;
		};
	};
	defaultVariants?: {
		[K in keyof Variants]?: keyof Variants[K] & string;
	};
	compoundVariants?: Array<{
		match: {
			[K in keyof Variants]?: keyof Variants[K] & string;
		};
		css?: RuntimeVariantDeclarationsBlock;
		className?: string;
	}>;
};

export type Recipe<
	Name extends string = string,
	Variants extends VariantsBase = VariantsBase,
> = {
	type: "recipe";
	name: Name;
	base?: VariantDeclarationsBlock;
	variants?: Variants;
	defaultVariants?: {
		[K in keyof Variants]?: keyof Variants[K] & string;
	};
	compoundVariants?: Array<{
		match: {
			[K in keyof Variants]?: keyof Variants[K] & string;
		};
		css?: VariantDeclarationsBlock;
		className?: string;
	}>;
	_runtime?: RecipeRuntime<Variants>;
	_exportName?: string;
};

export type PrimitiveTokenValue = number | string | boolean | null | undefined;

export type TokenValue =
	| PrimitiveTokenValue
	| Reference
	| CSS
	| Array<PrimitiveTokenValue | Reference | CSS>;

export type TokenType =
	| Variable["type"]
	| Reference["type"]
	| Selector["type"]
	| AtRule["type"]
	| CSS["type"]
	| Utility["type"]
	| ModifierFactory["type"]
	| Recipe["type"]
	| Theme["type"]
	| Root["type"];

export type Container = {
	id: string;
	parentId?: string;
	children: ContainerChild[];
	variables: Variable[];
	declarations: DeclarationsBlock;
};

export type ContainerInput = Pick<
	Container,
	"declarations" | "variables" | "children"
>;

export type ContainerChild = Variable | Selector | AtRule | Utility;

export type Theme = {
	type: "theme";
	id: string;
	parentId?: string;
	name: string;
	declarations: DeclarationsBlock;
	variables: Variable[];
	children: ContainerChild[];
};

/**
 * Facts kept at token-creation time that the finished tree no longer holds,
 * read by `validate()`.
 */
export type RootRecord =
	| {
			type: "duplicate-variable";
			scopeId: string;
			name: string;
			values: [TokenValue, TokenValue];
	  }
	| {
			type: "unresolved-utility-value";
			utility: string;
			key: string;
			reference: string;
	  };

export type Root = {
	type: "root";
	id: string;
	parentId?: string;
	declarations: DeclarationsBlock;
	utilities: UtilityFactory[];
	modifiers: ModifierFactory[];
	recipes: Recipe[];
	variables: Variable[];
	children: ContainerChild[];
	themes: Theme[];
	_registry: Map<string, Container | Root | Theme>;
	_usage: {
		variables: Set<string>;
		utilities: Set<string>;
		recipes: Set<string>;
		recipeUtilities: Map<string, Set<string>>;
	};
	_records?: RootRecord[];
};
