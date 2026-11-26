import path from "node:path";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { defineCommand } from "citty";
import consola from "consola";
import type { DTCGDocument } from "@styleframe/dtcg";
import { generateStyleframeCode, fromDTCG } from "@styleframe/figma";
import type { FigmaExportFormat, FigmaExportVariable } from "@styleframe/figma";

export default defineCommand({
	meta: {
		name: "import",
		description:
			"Generate Styleframe code from Figma-compatible DTCG per-mode files",
	},
	args: {
		input: {
			type: "string",
			description: "Input .tokens.json file or directory of per-mode files",
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
				const files = await readdir(inputPath);
				const tokenFiles = files
					.filter((f) => f.endsWith(".tokens.json"))
					.sort();

				if (tokenFiles.length === 0) {
					consola.error(
						`No .tokens.json files found in "${path.relative(process.cwd(), inputPath)}"`,
					);
					process.exit(1);
				}

				consola.info(
					`Found ${tokenFiles.length} mode file(s): ${tokenFiles.join(", ")}`,
				);

				const modeFormats: Array<FigmaExportFormat> = [];
				for (const file of tokenFiles) {
					const content = await readFile(path.join(inputPath, file), "utf8");
					const rawDoc = JSON.parse(content) as DTCGDocument;
					const modeName = extractModeName(rawDoc, file);
					const modeData = fromDTCG(rawDoc, {
						defaultModeName: modeName,
					});
					modeFormats.push(modeData);
				}

				data = mergeModeFormats(modeFormats);
			} else {
				const content = await readFile(inputPath, "utf8");
				const rawDoc = JSON.parse(content) as DTCGDocument;
				data = fromDTCG(rawDoc);
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

		consola.success("Generated Styleframe code with:");
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

function extractModeName(doc: DTCGDocument, filename: string): string {
	const ext = doc.$extensions as Record<string, unknown> | undefined;
	if (ext && typeof ext["com.figma.modeName"] === "string") {
		return ext["com.figma.modeName"];
	}
	const sfExt = ext?.["dev.styleframe"] as Record<string, unknown> | undefined;
	if (sfExt && typeof sfExt.modeName === "string") {
		return sfExt.modeName;
	}
	return filename.replace(/\.tokens\.json$/, "");
}

function mergeModeFormats(
	formats: Array<FigmaExportFormat>,
): FigmaExportFormat {
	if (formats.length === 1) {
		return formats[0]!;
	}

	const allModes: Array<string> = [];
	const variableMap = new Map<string, FigmaExportVariable>();

	for (const format of formats) {
		for (const mode of format.modes) {
			if (!allModes.includes(mode)) {
				allModes.push(mode);
			}
		}
		for (const v of format.variables) {
			const existing = variableMap.get(v.name);
			if (existing) {
				Object.assign(existing.values, v.values);
			} else {
				variableMap.set(v.name, { ...v, values: { ...v.values } });
			}
		}
	}

	return {
		collection: formats[0]!.collection,
		modes: allModes,
		variables: [...variableMap.values()],
	};
}
