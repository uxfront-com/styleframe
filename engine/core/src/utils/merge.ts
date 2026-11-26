import {
	isInstanceLicenseRequired,
	markInstanceLicenseRequired,
} from "@styleframe/license";
import type { Styleframe } from "../styleframe";
import { isRoot } from "../typeGuards";
import type {
	Container,
	ContainerChild,
	Root,
	Theme,
	Variable,
} from "../types";

export function mergeVariablesArray(a: Array<Variable>, b: Array<Variable>) {
	const variables = [...a];
	for (const newVariable of b) {
		const existingVariable = variables.find(
			(variable) => variable.name === newVariable.name,
		);

		if (existingVariable) {
			existingVariable.value = newVariable.value;
		} else {
			variables.push(newVariable);
		}
	}

	return variables;
}

export function mergeThemesArray(a: Array<Theme>, b: Array<Theme>) {
	const themes = [...a];
	for (const themeToBeAdded of b) {
		const existingTheme = themes.find(
			(theme) => theme.name === themeToBeAdded.name,
		);

		if (existingTheme) {
			Object.assign(
				existingTheme,
				mergeContainers(existingTheme, themeToBeAdded),
			);
		} else {
			themes.push(themeToBeAdded);
		}
	}

	return themes;
}

export function mergeContainers<T extends Container>(a: T, b: T) {
	return Object.keys(a).reduce<T>(
		(acc, key) => {
			if (key === "variables") {
				acc.variables = mergeVariablesArray(a.variables, b.variables);
			} else if (key === "declarations") {
				acc.declarations = { ...a.declarations, ...b.declarations };
			} else if (key === "themes" && isRoot(acc) && isRoot(a) && isRoot(b)) {
				acc.themes = mergeThemesArray(a.themes, b.themes);
			} else if (Array.isArray(a[key as keyof T])) {
				acc[key as keyof T] = (a[key as keyof T] as Array<unknown>).concat(
					b[key as keyof T],
				) as T[keyof T];
			}

			return acc;
		},
		{
			...a,
			...b,
		},
	);
}

function registerChildren(children: Array<ContainerChild>, root: Root) {
	for (const child of children) {
		if ("id" in child && typeof child.id === "string") {
			root._registry.set(child.id, child as Container);
			if ("children" in child) {
				registerChildren((child as Container).children, root);
			}
		}
	}
}

export function rebuildRegistry(root: Root) {
	root._registry = new Map();
	root._registry.set(root.id, root);
	registerChildren(root.children, root);
	for (const theme of root.themes) {
		root._registry.set(theme.id, theme);
		registerChildren(theme.children, root);
	}
}

export function merge(base: Styleframe, ...instances: Array<Styleframe>) {
	return instances.reduce((prev, curr) => {
		const result = {
			...prev,
			root: mergeContainers(prev.root, curr.root),
		};

		rebuildRegistry(result.root);

		if (isInstanceLicenseRequired(prev) || isInstanceLicenseRequired(curr)) {
			markInstanceLicenseRequired(result);
		}

		return result;
	}, base);
}
