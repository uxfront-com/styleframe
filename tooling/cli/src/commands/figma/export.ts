import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Root } from "@styleframe/core";
import { loadConfiguration } from "@styleframe/loader";
import { flattenToFigmaDTCG } from "@styleframe/figma";
import { defineCommand } from "citty";
import consola from "consola";
import { buildDTCG } from "../dtcg/build-dtcg";

export default defineCommand({
	meta: {
		name: "export",
		description:
			"Export Styleframe variables to Figma-compatible DTCG format (per-mode files)",
	},
	args: {
		config: {
			type: "string",
			description: "Path to the Styleframe config file",
			default: "styleframe.config.ts",
			alias: ["c"],
			valueHint: "path",
		},
		output: {
			type: "string",
			description: "Output directory for per-mode .tokens.json files",
			default: ".",
			alias: ["o"],
			valueHint: "path",
		},
		collection: {
			type: "string",
			description: "Collection name embedded in the export",
			default: "Design Tokens",
			alias: ["n", "name"],
		},
	},
	async run({ args }) {
		const configPath = path.resolve(args.config);
		const outputDir = path.resolve(args.output);

		consola.info(
			`Loading configuration from "${path.relative(process.cwd(), configPath)}"...`,
		);

		const instance = await loadConfiguration({ entry: configPath });
		const root = instance.root as Root;

		consola.info("Building DTCG document...");

		const {
			tokens,
			resolver,
			diagnostics: buildDiags,
			emittedCount,
			fluidNormalisedCount,
			maxViewport,
		} = buildDTCG(root, { collectionName: args.collection });

		consola.info("Flattening to Figma-compatible format...");

		const { modes, diagnostics: flattenDiags } = await flattenToFigmaDTCG(
			tokens,
			resolver,
		);

		await mkdir(outputDir, { recursive: true });

		for (const [modeName, modeDoc] of Object.entries(modes)) {
			const filename = `${modeName}.tokens.json`;
			const filePath = path.join(outputDir, filename);
			await writeFile(filePath, `${JSON.stringify(modeDoc, null, 2)}\n`);

			const tokenCount = countTokens(modeDoc);
			consola.info(
				`Wrote "${path.relative(process.cwd(), filePath)}" (${tokenCount} tokens)`,
			);
		}

		if (fluidNormalisedCount > 0) {
			consola.info(
				`Normalised ${fluidNormalisedCount} fluid token(s) using max viewport (${maxViewport}px).`,
			);
		}

		const allDiags = [
			...buildDiags.filter((d) => d.level === "warn"),
			...flattenDiags,
		];
		if (allDiags.length > 0) {
			consola.warn(`${allDiags.length} token(s) needed special handling`);
			for (const d of allDiags.slice(0, 10)) {
				const name = "name" in d ? d.name : d.path;
				const reason = "reason" in d ? d.reason : "";
				consola.info(`  - ${name}: ${reason}`);
			}
			if (allDiags.length > 10) {
				consola.info(`  ... and ${allDiags.length - 10} more`);
			}
		}

		consola.success(
			`Exported ${emittedCount} tokens as ${Object.keys(modes).length} Figma-compatible mode file(s) to "${path.relative(process.cwd(), outputDir)}"`,
		);
	},
});

function countTokens(doc: Record<string, unknown>): number {
	let count = 0;
	for (const [key, value] of Object.entries(doc)) {
		if (key === "$root") {
			if (
				typeof value === "object" &&
				value !== null &&
				!Array.isArray(value) &&
				"$value" in value
			) {
				count++;
			}
			continue;
		}
		if (key.startsWith("$")) {
			continue;
		}
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			if ("$value" in value) {
				count++;
			}
			count += countTokens(value as Record<string, unknown>);
		}
	}
	return count;
}
