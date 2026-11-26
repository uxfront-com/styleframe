import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "dtcg",
		description: "Export Styleframe variables to and import them from DTCG format",
	},
	subCommands: {
		export: () => import("./export").then((m) => m.default),
		import: () => import("./import").then((m) => m.default),
	},
});
