import type { ThemeSelectorFn, VariableNameFn } from "@styleframe/core";

export { defaultUtilitySelectorFn } from "@styleframe/core";

export const defaultThemeSelectorFn: ThemeSelectorFn = ({ name }) => {
	return `.${name}-theme, [data-theme="${name}"]`;
};

export const defaultVariableNameFn: VariableNameFn = ({ name }) => {
	return name.replaceAll(/^\.+|\.+$/g, "").replaceAll(/\.+/g, "--");
};
