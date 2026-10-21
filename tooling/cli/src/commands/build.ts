import path from "node:path";
import { validate } from "@styleframe/core";
import { build, loadConfiguration } from "@styleframe/loader";
import { defineCommand } from "citty";
import consola from "consola";
import { formatDiagnostic, pluralize } from "../utils";

export default defineCommand({
	meta: {
		name: "build",
		description: "Build Styleframe project from source files",
	},
	args: {
		entry: {
			type: "positional",
			description: "Entry point file(s) for the build",
			default: "styleframe.config.ts",
			valueHint: "path",
		},
		outputDir: {
			type: "string",
			description: "Output directory for built files",
			default: "styleframe",
			alias: ["o", "out"],
			valueHint: "path",
		},
		clean: {
			type: "boolean",
			description: "Clean output directory before build",
			default: false,
		},
	},
	async run({ args }) {
		consola.info(
			`Loading configuration from "${path.relative(process.cwd(), path.resolve(args.entry))}"...`,
		);

		const instance = await loadConfiguration({ entry: args.entry });

		const diagnostics = validate(instance);
		for (const diagnostic of diagnostics) {
			consola.warn(formatDiagnostic(diagnostic));
		}

		if (instance.options.strict && diagnostics.length > 0) {
			consola.error(
				`Failed to build Styleframe: strict mode found ${pluralize(diagnostics.length, "problem")}.`,
			);
			process.exitCode = 1;
			return;
		}

		consola.info("Building styleframe...");

		try {
			await build(instance, {
				outputDir: args.outputDir,
				clean: args.clean,
			});

			consola.success("Styleframe built successfully!");
		} catch (error) {
			consola.error("Failed to build Styleframe:", error);
			process.exitCode = 1;
		}
	},
});
