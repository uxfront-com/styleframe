import type {
	Styleframe,
	Recipe,
	VariantDeclarationsBlock,
} from "@styleframe/core";
import { defu } from "defu";

export type RecipeConfig<
	Variants extends Record<string, Record<string, VariantDeclarationsBlock>> =
		Record<string, Record<string, VariantDeclarationsBlock>>,
> = {
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
};

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type FilterConfig<
	Variants extends Record<string, Record<string, VariantDeclarationsBlock>>,
> = {
	[K in keyof Variants]?: Array<keyof Variants[K] & string>;
};

export type ApplyFilter<
	V extends Record<string, Record<string, VariantDeclarationsBlock>>,
	F,
> = {
	[K in keyof V]: K extends keyof F
		? F[K] extends Array<infer U>
			? Pick<V[K], Extract<U, keyof V[K]>>
			: V[K]
		: V[K];
};

function applyFilter(
	config: RecipeConfig,
	filter: Record<string, Array<string> | undefined>,
): RecipeConfig {
	const result = { ...config };

	if (result.variants) {
		const filteredVariants = { ...result.variants };
		for (const axis of Object.keys(filter)) {
			const allowedValues = filter[axis];
			if (!allowedValues || !(axis in filteredVariants)) {
				continue;
			}

			const allowedSet = new Set(allowedValues);
			const original = filteredVariants[axis];
			if (!original) {
				continue;
			}

			const filtered: Record<string, VariantDeclarationsBlock> = {};
			for (const [key, value] of Object.entries(original)) {
				if (allowedSet.has(key)) {
					filtered[key] = value;
				}
			}
			filteredVariants[axis] = filtered;
		}
		result.variants = filteredVariants;
	}

	if (result.compoundVariants) {
		result.compoundVariants = result.compoundVariants.filter((compound) => {
			for (const [axis, matchValue] of Object.entries(compound.match)) {
				const allowedValues = filter[axis];
				if (allowedValues) {
					const allowedSet = new Set(allowedValues);
					if (!allowedSet.has(matchValue as string)) {
						return false;
					}
				}
			}
			return true;
		});
	}

	if (result.defaultVariants) {
		const adjustedDefaults = { ...result.defaultVariants };
		for (const axis of Object.keys(filter)) {
			const allowedValues = filter[axis];
			if (!allowedValues || !(axis in adjustedDefaults)) {
				continue;
			}

			const allowedSet = new Set(allowedValues);
			const currentDefault = (adjustedDefaults as Record<string, string>)[axis];
			if (currentDefault && !allowedSet.has(currentDefault)) {
				delete (adjustedDefaults as Record<string, string>)[axis];
			}
		}
		result.defaultVariants = adjustedDefaults;
	}

	return result;
}

export function createUseRecipe<
	Name extends string,
	const Config extends RecipeConfig,
>(name: Name, defaults: Config, setup?: (s: Styleframe) => void) {
	type Variants = NonNullable<Config["variants"]>;

	return function useRecipe<F extends FilterConfig<Variants> = {}>(
		s: Styleframe,
		options?: DeepPartial<RecipeConfig<Variants>> & { filter?: F },
	): Recipe<Name, ApplyFilter<Variants, F>> {
		if (setup) {
			setup(s);
		}

		const { filter, ...configOverrides } = options ?? {};
		const merged = defu(configOverrides, defaults) as RecipeConfig;
		const filtered = filter ? applyFilter(merged, filter) : merged;
		const recipe = s.recipe({
			name,
			...filtered,
		}) as Recipe<Name, ApplyFilter<Variants, F>>;

		return recipe;
	};
}
