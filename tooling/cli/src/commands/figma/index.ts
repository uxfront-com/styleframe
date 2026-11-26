import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "figma",
		description: "Export and import Figma-compatible DTCG format (per-mode files)",
	},
	subCommands: {
		export: () => import("./export").then((m) => m.default),
		import: () => import("./import").then((m) => m.default),
	},
});
