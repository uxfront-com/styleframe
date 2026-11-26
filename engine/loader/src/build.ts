import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Styleframe } from "@styleframe/core";
import { getLicenseKeyFromEnv, validateInstanceLicense } from "@styleframe/license";
import type { TranspileOptions } from "@styleframe/transpiler";
import { transpile } from "@styleframe/transpiler";

import { directoryExists } from "./utils";

export type BuildOptions = {
	clean?: boolean;
	outputDir?: string;
	transpiler?: TranspileOptions;
};

export async function build(
	instance: Styleframe,
	{ clean = true, outputDir = "./styleframe", transpiler }: BuildOptions = {},
) {
	await validateInstanceLicense(instance, {
		licenseKey: getLicenseKeyFromEnv() || "",
		environment: process.env.NODE_ENV || "development",
		isBuild: true,
	});

	const output = await transpile(instance, transpiler);

	const outputDirExists = await directoryExists(outputDir);
	if (clean && outputDirExists) {
		await rm(outputDir, { recursive: true });
	}

	for (const file of output.files) {
		const filePath = path.join(outputDir, file.name);

		const fileOutputDirPath = path.dirname(filePath);
		const fileOutputDirExists = await directoryExists(fileOutputDirPath);
		if (!fileOutputDirExists) {
			await mkdir(fileOutputDirPath, { recursive: true });
		}

		await writeFile(filePath, file.content);
	}
}
