import type { Root } from "../types";
import { generateRandomId } from "../utils";

export function createRoot(): Root {
	const root: Root = {
		type: "root",
		id: generateRandomId("rt-"),
		declarations: {},
		utilities: [],
		modifiers: [],
		recipes: [],
		variables: [],
		children: [],
		themes: [],
		_registry: new Map(),
		_usage: {
			variables: new Set(),
			utilities: new Set(),
			recipes: new Set(),
			recipeUtilities: new Map(),
		},
		_records: [],
	};

	root._registry.set(root.id, root);

	return root;
}
