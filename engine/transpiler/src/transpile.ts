import type {
	Diagnostic,
	Styleframe,
	StyleframeOptions,
} from "@styleframe/core";
import { validate } from "@styleframe/core";
import {
	isInstanceLicenseRequired,
	getInstanceLicenseValidationInfo,
} from "@styleframe/license";
import { consume as consumeCSS } from "./consume/css";
import {
	DTS_SHIMS_FILENAME,
	DTS_TYPES_FILENAME,
	consume as consumeDTS,
	generateShims,
} from "./consume/dts";
import { consume as consumeTS } from "./consume/ts";
import { defaultUtilitySelectorFn } from "./defaults";
import { addLicenseWatermark } from "./license";
import { generateShorteningMap, shortenUtilityOptions } from "./minify";
import type {
	Output,
	OutputFile,
	TranspileContext,
	TranspileOptions,
} from "./types";

export function createFile(name: string, content: string = ""): OutputFile {
	return {
		name,
		content,
	};
}

export async function transpile(
	instance: Styleframe,
	{
		type = "all",
		treeshake = false,
		scanner = false,
		minify = false,
		minifyOptions,
		consumers = { css: consumeCSS, ts: consumeTS, dts: consumeDTS },
	}: TranspileOptions = {},
): Promise<Output> {
	const output: Output = { files: [] };
	const options = instance.options;
	const context: TranspileContext = { treeshake, scanner };

	if (minify) {
		const shortMap = generateShorteningMap(instance.root, minifyOptions);
		context.shortMap = shortMap;
	}

	if (isInstanceLicenseRequired(instance)) {
		const validationInfo = await getInstanceLicenseValidationInfo(instance);
		if (!validationInfo.valid || validationInfo.instanceId !== instance.id) {
			addLicenseWatermark(instance);
		}
	}

	const diagnostics = validate(instance);
	if (options.strict && diagnostics.length > 0) {
		throw new Error(formatDiagnostics(diagnostics));
	}
	output.diagnostics = diagnostics;

	if (type === "all" || type === "css") {
		const cssOptions = createCSSOptions(options, context);
		const indexFile = createFile(
			"index.css",
			consumers.css(instance.root, cssOptions, context),
		);
		output.files.push(indexFile);
	}

	if (type === "all" || type === "ts") {
		const indexFile = createFile(
			"index.ts",
			consumers.ts(instance.root, options, context),
		);
		output.files.push(indexFile);
	}

	if (type === "dts") {
		const typesContent = consumers.dts(instance.root, options);
		output.files.push(
			createFile(DTS_TYPES_FILENAME, typesContent),
			createFile(DTS_SHIMS_FILENAME, generateShims(typesContent)),
		);
	}

	return output;
}

function formatDiagnostics(diagnostics: Diagnostic[]): string {
	const count = `${diagnostics.length} ${diagnostics.length === 1 ? "problem" : "problems"}`;
	const lines = diagnostics.map(
		({ code, path, message }) => `  ${code} ${path}: ${message}`,
	);

	return [`[styleframe] Strict mode found ${count}:`, ...lines].join("\n");
}

function createCSSOptions(
	options: StyleframeOptions,
	context: TranspileContext,
): StyleframeOptions {
	if (!context.shortMap) return options;

	const baseSelectorFn =
		options.utilities?.selector ?? defaultUtilitySelectorFn;

	return {
		...options,
		utilities: {
			...options.utilities,
			selector: (opts) =>
				baseSelectorFn(shortenUtilityOptions(opts, context.shortMap!)),
		},
	};
}
