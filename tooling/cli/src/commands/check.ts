import path from "node:path";
import { validate } from "@styleframe/core";
import { loadConfiguration } from "@styleframe/loader";
import { defineCommand } from "citty";
import consola from "consola";
import { configFileExists, formatDiagnostic, pluralize } from "../utils";

export default defineCommand({
	meta: {
		name: "check",
		description:
			"Check a Styleframe configuration for problems without writing any files",
	},
	args: {
		entry: {
			type: "positional",
			description: "Entry point file to check",
			default: "styleframe.config.ts",
			valueHint: "path",
		},
		json: {
			type: "boolean",
			description: "Print the result as one JSON document on stdout",
			default: false,
		},
	},
	async run({ args }) {
		if (!configFileExists(args.entry)) {
			consola.error(`Config file not found: ${args.entry}`);
			process.exitCode = 1;
			return;
		}

		if (!args.json) {
			consola.info(
				`Loading configuration from "${path.relative(process.cwd(), path.resolve(args.entry))}"...`,
			);
		}

		const instance = await loadConfiguration({ entry: args.entry });
		const diagnostics = validate(instance);

		if (diagnostics.length > 0) {
			process.exitCode = 1;
		}

		if (args.json) {
			process.stdout.write(
				`${JSON.stringify({ ok: diagnostics.length === 0, diagnostics }, null, 2)}\n`,
			);
			return;
		}

		for (const diagnostic of diagnostics) {
			consola.warn(formatDiagnostic(diagnostic));
		}

		if (diagnostics.length > 0) {
			consola.error(`Found ${pluralize(diagnostics.length, "problem")}.`);
		} else {
			consola.success("No problems found.");
		}
	},
});
