import type { ModifierFactory, Styleframe } from "@styleframe/core";

export interface FormStateModifiers {
	disabled: ModifierFactory;
	enabled: ModifierFactory;
	checked: ModifierFactory;
	indeterminate: ModifierFactory;
	required: ModifierFactory;
	optional: ModifierFactory;
	valid: ModifierFactory;
	invalid: ModifierFactory;
	placeholderShown: ModifierFactory;
	autofill: ModifierFactory;
	readOnly: ModifierFactory;
	readonly: ModifierFactory;
	readonlyAttr: ModifierFactory;
}

export function useDisabledModifier(s: Styleframe): ModifierFactory {
	return s.modifier("disabled", ({ declarations, variables, children }) => ({
		"&:disabled": { declarations, variables, children },
	}));
}

export function useEnabledModifier(s: Styleframe): ModifierFactory {
	return s.modifier("enabled", ({ declarations, variables, children }) => ({
		"&:enabled": { declarations, variables, children },
	}));
}

export function useCheckedModifier(s: Styleframe): ModifierFactory {
	return s.modifier("checked", ({ declarations, variables, children }) => ({
		"&:checked": { declarations, variables, children },
	}));
}

export function useIndeterminateModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"indeterminate",
		({ declarations, variables, children }) => ({
			"&:indeterminate": { declarations, variables, children },
		}),
	);
}

export function useRequiredModifier(s: Styleframe): ModifierFactory {
	return s.modifier("required", ({ declarations, variables, children }) => ({
		"&:required": { declarations, variables, children },
	}));
}

export function useOptionalModifier(s: Styleframe): ModifierFactory {
	return s.modifier("optional", ({ declarations, variables, children }) => ({
		"&:optional": { declarations, variables, children },
	}));
}

export function useValidModifier(s: Styleframe): ModifierFactory {
	return s.modifier("valid", ({ declarations, variables, children }) => ({
		"&:valid": { declarations, variables, children },
	}));
}

export function useInvalidModifier(s: Styleframe): ModifierFactory {
	return s.modifier("invalid", ({ declarations, variables, children }) => ({
		"&:invalid": { declarations, variables, children },
	}));
}

export function usePlaceholderShownModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"placeholder-shown",
		({ declarations, variables, children }) => ({
			"&:placeholder-shown": { declarations, variables, children },
		}),
	);
}

export function useAutofillModifier(s: Styleframe): ModifierFactory {
	return s.modifier("autofill", ({ declarations, variables, children }) => ({
		"&:autofill": { declarations, variables, children },
	}));
}

export function useReadOnlyModifier(s: Styleframe): ModifierFactory {
	return s.modifier("read-only", ({ declarations, variables, children }) => ({
		"&:read-only": { declarations, variables, children },
	}));
}

export function useReadonlyModifier(s: Styleframe): ModifierFactory {
	return s.modifier("readonly", ({ declarations, variables, children }) => ({
		"&:read-only": { declarations, variables, children },
	}));
}

export function useReadonlyAttrModifier(s: Styleframe): ModifierFactory {
	return s.modifier(
		"readonly-attr",
		({ declarations, variables, children }) => ({
			"&[readonly]": { declarations, variables, children },
		}),
	);
}

/**
 * Register form state modifiers for form element pseudo-classes.
 *
 * @example
 * ```typescript
 * const s = styleframe();
 * const { disabled, invalid } = useFormStateModifiers(s);
 *
 * const createOpacity = utility("opacity", ({ value }) => ({ opacity: value }));
 * createOpacity({ 50: "0.5" }, [disabled]);
 * ```
 */
export function useFormStateModifiers(s: Styleframe): FormStateModifiers {
	return {
		disabled: useDisabledModifier(s),
		enabled: useEnabledModifier(s),
		checked: useCheckedModifier(s),
		indeterminate: useIndeterminateModifier(s),
		required: useRequiredModifier(s),
		optional: useOptionalModifier(s),
		valid: useValidModifier(s),
		invalid: useInvalidModifier(s),
		placeholderShown: usePlaceholderShownModifier(s),
		autofill: useAutofillModifier(s),
		readOnly: useReadOnlyModifier(s),
		readonly: useReadonlyModifier(s),
		readonlyAttr: useReadonlyAttrModifier(s),
	};
}
