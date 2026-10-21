import path from "node:path";
import { validate } from "@styleframe/core";
import { loadConfiguration } from "@styleframe/loader";
import { defineCommand } from "citty";
import consola from "consola";
import { resolveTsc, typecheck } from "../typecheck";
import {
	type CheckDiagnostic,
	formatDiagnostic,
	pluralize,
	resolveConfigFile,
} from "../utils";

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
		typecheck: {
			type: "boolean",
			description:
				"Also type-check the entry file with the project's TypeScript",
			default: false,
		},
	},
	async run({ args }) {
		const file = resolveConfigFile(args.entry);
		if (!file) {
			consola.error(`Config file not found: ${args.entry}`);
			process.exitCode = 1;
			return;
		}

		const tsc = args.typecheck ? resolveTsc(file) : undefined;
		if (args.typecheck && !tsc) {
			consola.error(
				"TypeScript not found: install `typescript` in your project to use --typecheck.",
			);
			process.exitCode = 1;
			return;
		}

		if (!args.json) {
			consola.info(
				`Loading configuration from "${path.relative(process.cwd(), path.resolve(args.entry))}"...`,
			);
		}

		const instance = await loadConfiguration({ entry: args.entry });
		const diagnostics: CheckDiagnostic[] = validate(instance);

		if (tsc) {
			diagnostics.push(...(await typecheck(file, tsc)));
		}

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
