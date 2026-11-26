import path from "node:path";
import { readFile, stat, writeFile } from "node:fs/promises";
import { defineCommand } from "citty";
import consola from "consola";
import type { DTCGDocument, DTCGResolverDocument } from "@styleframe/dtcg";
import {
	generateStyleframeCode,
	fromDTCG,
	fromDTCGResolver,
} from "@styleframe/figma";
import type { FigmaExportFormat } from "@styleframe/figma";

export default defineCommand({
	meta: {
		name: "import",
		description: "Generate Styleframe code from DTCG format JSON",
	},
	args: {
		input: {
			type: "string",
			description: "Input DTCG JSON file or directory containing tokens.json",
			required: true,
			alias: ["i"],
			valueHint: "path",
		},
		output: {
			type: "string",
			description: "Output Styleframe TypeScript file path",
			default: "tokens.styleframe.ts",
			alias: ["o"],
			valueHint: "path",
		},
		composables: {
			type: "boolean",
			description:
				"Use @styleframe/theme composables (useColor, useSpacing, etc.)",
			default: true,
		},
		rem: {
			type: "boolean",
			description: "Use rem units for dimensions instead of px",
			default: false,
		},
		baseFontSize: {
			type: "string",
			description: "Base font size for rem conversion (in pixels)",
			default: "16",
		},
		instanceName: {
			type: "string",
			description: "Name for the Styleframe instance variable",
			default: "s",
		},
	},
	async run({ args }) {
		const inputPath = path.resolve(args.input);
		const outputPath = path.resolve(args.output);
		const baseFontSize = Number.parseInt(args.baseFontSize, 10) || 16;

		consola.info(
			`Reading from "${path.relative(process.cwd(), inputPath)}"...`,
		);

		let data: FigmaExportFormat;
		try {
			const inputStat = await stat(inputPath);

			if (inputStat.isDirectory()) {
				data = await readFromDirectory(inputPath);
			} else {
				data = await readFromFile(inputPath);
			}
		} catch (error) {
			consola.error(
				`Failed to read or parse input: ${error instanceof Error ? error.message : error}`,
			);
			process.exit(1);
		}

		consola.info(
			`Generating Styleframe code for ${data.variables.length} variables...`,
		);

		const result = generateStyleframeCode(data, {
			useComposables: args.composables,
			useRem: args.rem,
			baseFontSize,
			instanceName: args.instanceName,
		});

		consola.info(`Writing to "${path.relative(process.cwd(), outputPath)}"...`);

		await writeFile(outputPath, result.code);

		consola.success(`Generated Styleframe code with:`);
		consola.info(`  - ${result.variables.length} variables`);
		consola.info(`  - ${result.themes.length} theme(s)`);
		if (args.composables && result.imports.length > 1) {
			consola.info(
				`  - Using composables: ${result.imports.slice(1).join(", ")}`,
			);
		}
		consola.info(`\nOutput: ${path.relative(process.cwd(), outputPath)}`);
	},
});

async function readFromDirectory(dirPath: string): Promise<FigmaExportFormat> {
	const tokensPath = path.join(dirPath, "tokens.json");
	const content = await readFile(tokensPath, "utf8");
	const tokensDoc = JSON.parse(content) as DTCGDocument;

	const resolverPath = path.join(dirPath, "tokens.resolver.json");
	const resolverDoc = await tryReadJson<DTCGResolverDocument>(resolverPath);

	if (resolverDoc) {
		consola.info(
			`Found resolver: "${path.relative(process.cwd(), resolverPath)}"`,
		);
		return fromDTCGResolver(resolverDoc, {
			fileLoader: async (ref) => {
				if (ref === "tokens.json") {
					return tokensDoc;
				}
				throw new Error(
					`Resolver references "${ref}" but only "tokens.json" was found`,
				);
			},
		});
	}

	return fromDTCG(tokensDoc);
}

async function readFromFile(filePath: string): Promise<FigmaExportFormat> {
	const content = await readFile(filePath, "utf8");
	const tokensDoc = JSON.parse(content) as DTCGDocument;

	const resolverPath = filePath.replace(/\.json$/, ".resolver.json");
	const resolverDoc = await tryReadJson<DTCGResolverDocument>(resolverPath);

	if (resolverDoc) {
		consola.info(
			`Auto-detected resolver: "${path.relative(process.cwd(), resolverPath)}"`,
		);
		return fromDTCGResolver(resolverDoc, {
			fileLoader: async (ref) => {
				if (ref === path.basename(filePath)) {
					return tokensDoc;
				}
				throw new Error(
					`Resolver references "${ref}" but only "${path.basename(filePath)}" was provided`,
				);
			},
		});
	}

	return fromDTCG(tokensDoc);
}

async function tryReadJson<T>(filePath: string): Promise<T | undefined> {
	try {
		const content = await readFile(filePath, "utf8");
		return JSON.parse(content) as T;
	} catch {
		return undefined;
	}
}
