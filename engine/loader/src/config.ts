import { existsSync } from "node:fs";
import path from "node:path";

import type { Styleframe } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { watch } from "chokidar";

import { loadModule } from "./module";

const SUPPORTED_EXTENSIONS = [".ts", ".mts", ".cts", ".js", ".mjs", ".cjs"];

function hasKnownExtension(filePath: string): boolean {
	return SUPPORTED_EXTENSIONS.some((ext) => filePath.endsWith(ext));
}

function resolveConfigFile(cwd: string, entry: string): string | undefined {
	const basePath = path.isAbsolute(entry) ? entry : path.join(cwd, entry);

	if (hasKnownExtension(basePath)) {
		return existsSync(basePath) ? basePath : undefined;
	}

	for (const ext of SUPPORTED_EXTENSIONS) {
		const filePath = `${basePath}${ext}`;
		if (existsSync(filePath)) {
			return filePath;
		}
	}

	return undefined;
}

export async function loadConfiguration({
	cwd = process.cwd(),
	entry = "styleframe.config",
}: {
	cwd?: string;
	entry?: string;
} = {}) {
	const resolvedPath = resolveConfigFile(cwd, entry);

	if (!resolvedPath) {
		// Return default instance if no config found
		return styleframe();
	}

	const { instance } = await loadModule(resolvedPath);
	return instance;
}

export async function watchConfiguration({
	cwd = process.cwd(),
	entry = "styleframe.config",
	onUpdate,
	onError,
}: {
	cwd?: string;
	entry?: string;
	onUpdate?: (config: Styleframe) => void;
	onError?: (error: Error) => void;
} = {}) {
	const resolvedPath = resolveConfigFile(cwd, entry);
	if (!resolvedPath) {
		throw new Error(`Config file not found: ${entry}`);
	}

	const watcher = watch(resolvedPath, { ignoreInitial: true });

	watcher.on("change", async () => {
		try {
			const config = await loadConfiguration({ entry: resolvedPath });
			onUpdate?.(config);
		} catch (error) {
			onError?.(error instanceof Error ? error : new Error(String(error)));
		}
	});

	watcher.on("unlink", () => {
		onError?.(new Error(`Config file was deleted: ${resolvedPath}`));
	});

	return {
		config: await loadConfiguration({ entry: resolvedPath }),
		configFile: resolvedPath,
		unwatch: () => watcher.close(),
	};
}
