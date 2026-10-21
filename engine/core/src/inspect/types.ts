export type InspectVariable = {
	/** The token name, e.g. `color.primary` */
	name: string;
	/** The CSS custom property it emits, e.g. `--color--primary` */
	property: string;
	/** The value as emitted in CSS, e.g. `var(--color--brand)` */
	value: string;
};

export type InspectTheme = {
	name: string;
	/** The CSS selector the theme emits under */
	selector: string;
	overrides: Array<{ name: string; value: string }>;
};

export type InspectUtility = {
	name: string;
	/** The value keys the utility was created with */
	values: string[];
	/** Every class name the utility emits, modifier variants included */
	classNames: string[];
	/** The modifier keys applied to the utility */
	modifiers: string[];
};

export type InspectModifier = {
	key: string[];
};

export type InspectRecipe = {
	name: string;
	/** Each variant axis and its option names */
	variants: Record<string, string[]>;
	defaultVariants: Record<string, string>;
};

/** A JSON-serialisable snapshot of what a Styleframe instance defines */
export type InspectSnapshot = {
	variables: InspectVariable[];
	themes: InspectTheme[];
	utilities: InspectUtility[];
	modifiers: InspectModifier[];
	recipes: InspectRecipe[];
};
