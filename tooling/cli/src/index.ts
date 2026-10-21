#!/usr/bin/env node
import { defineCommand, runMain } from "citty";

const main = defineCommand({
	meta: {
		name: "styleframe",
		version: __CLI_VERSION__,
		description: __CLI_DESCRIPTION__,
	},
	subCommands: {
		init: () => import("./commands/init").then((m) => m.default),
		build: () => import("./commands/build").then((m) => m.default),
		check: () => import("./commands/check").then((m) => m.default),
		dtcg: () => import("./commands/dtcg").then((m) => m.default),
		figma: () => import("./commands/figma").then((m) => m.default),
	},
});

export default function run() {
	runMain(main);
}
