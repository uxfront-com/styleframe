import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Root } from "@styleframe/core";
import { loadConfiguration } from "@styleframe/loader";
import { defineCommand } from "citty";
import consola from "consola";

import { buildDTCG } from "./build-dtcg";

export default defineCommand({
	meta: {
		name: "export",
		description: "Export Styleframe variables to spec-conformant DTCG JSON",
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
			description: "Output directory for DTCG files",
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

		consola.info(`Loading configuration from "${path.relative(process.cwd(), configPath)}"...`);

		const instance = await loadConfiguration({ entry: configPath });
		const root = instance.root as Root;

		consola.info("Building DTCG document...");

		const { tokens, resolver, diagnostics, emittedCount, fluidNormalisedCount, maxViewport } =
			buildDTCG(root, {
				collectionName: args.collection,
				tokensSourceRef: "tokens.json",
			});

		await mkdir(outputDir, { recursive: true });

		const tokensPath = path.join(outputDir, "tokens.json");
		await writeFile(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`);
		consola.info(`Wrote ${emittedCount} tokens to "${path.relative(process.cwd(), tokensPath)}"`);

		if (fluidNormalisedCount > 0) {
			consola.info(
				`Normalised ${fluidNormalisedCount} fluid token(s) using max viewport (${maxViewport}px).`,
			);
		}

		if (resolver) {
			const resolverPath = path.join(outputDir, "tokens.resolver.json");
			await writeFile(resolverPath, `${JSON.stringify(resolver, null, 2)}\n`);
			consola.info(`Wrote resolver to "${path.relative(process.cwd(), resolverPath)}"`);
		}

		const warnings = diagnostics.filter((d) => d.level === "warn");
		if (warnings.length > 0) {
			consola.warn(
				`${warnings.length} variable(s) needed special handling — see Styleframe ↔ DTCG round-trip notes`,
			);
			for (const w of warnings.slice(0, 10)) {
				consola.info(`  - ${w.name}: ${w.reason}`);
			}
			if (warnings.length > 10) {
				consola.info(`  ... and ${warnings.length - 10} more`);
			}
			consola.info(
				'Tip: untyped tokens are usually CSS keywords (e.g. "normal", "thin", "italic") with no DTCG equivalent — they round-trip to Figma as STRING variables.',
			);
		}

		consola.success(
			`Exported ${emittedCount} tokens in DTCG format to "${path.relative(process.cwd(), outputDir)}"`,
		);
	},
});
