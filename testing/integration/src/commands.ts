import shell from "shelljs";
import path from "node:path";
import fs from "node:fs";
import assert from "node:assert";

import { DEFAULT_VITE_CONFIG } from "./constants";

export function buildPackages(cwd: string) {
	shell.exec("pnpm run build:nodocs", { cwd });

	if (shell.error()) {
		console.error("Build failed");
		process.exit(1);
	}
}

function mapTarballsToPackages(
	cwd: string,
	files: Array<string>,
): Record<string, string> {
	const scopePrefix = "@styleframe/";
	const map: Record<string, string> = {};

	files.forEach((file) => {
		// Remove `.tgz` extension
		const base = file.replace(/\.tgz$/, "");
		// Extract package name without version
		const name = base.replace(/-\d+\.\d+\.\d+$/, "");

		// Convert scoped packages
		const scopedName =
			name === "styleframe"
				? name
				: `${scopePrefix}${name.replace(/^styleframe-/, "")}`;

		map[scopedName] = path.join(cwd, file);
	});

	return map;
}

export function createPackageTarballs(
	cwd: string,
	{
		filter = [],
		outputDir = "dist",
	}: { filter?: Array<string>; outputDir?: string } = {},
) {
	shell.exec(
		`pnpm pack --recursive --pack-destination ${outputDir} ${filter.map((f) => `--filter '${f}'`).join(" ")}`,
		{
			cwd,
		},
	);

	const tarballCwd = `${cwd}/${outputDir}`;
	const tarballs = shell
		.exec(`ls *.tgz`, { cwd: tarballCwd })
		.stdout.split("\n")
		.filter(Boolean);

	return mapTarballsToPackages(tarballCwd, tarballs);
}

export function createStarterVitePackage(
	cwd: string,
	{
		outputDir = "tmp/vite",
		template = "vue-ts",
	}: {
		outputDir?: string;
		template?: string;
	} = {},
) {
	const targetDir = path.join(cwd, outputDir);

	shell.exec(`pnpm create vite@latest --template ${template} ${outputDir}`, {
		cwd,
	});

	shell.exec("rm -rf src/*", { cwd: targetDir });

	return targetDir;
}

export function installStyleframeUsingCLI(
	cwd: string,
	packageToTarballMap: Record<string, string>,
) {
	// Set up overrides BEFORE installing styleframe to ensure npm uses local tarballs
	// instead of trying to resolve unpublished versions from the registry
	const packageJSONRaw = fs.readFileSync(`${cwd}/package.json`, "utf8");

	const packageJSON = JSON.parse(packageJSONRaw);
	packageJSON.overrides ||= {};

	for (const key in packageToTarballMap) {
		if (key.startsWith("@styleframe")) {
			packageJSON.overrides[key] = `file:${packageToTarballMap[key]}`;
		}
	}

	packageJSON.scripts ||= {};
	packageJSON.scripts.init = `npx styleframe init --cwd ${cwd}`;

	fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(packageJSON, null, 2));

	console.log(JSON.stringify(packageJSON, null, 2));

	// Now install styleframe and vue-router with overrides already in place
	shell.exec(
		`npm install -D ${packageToTarballMap["styleframe"]} && npm install vue-router`,
		{
			cwd,
		},
	);

	fs.writeFileSync(`${cwd}/vite.config.ts`, DEFAULT_VITE_CONFIG);

	shell.exec(`npm run init`, { cwd });

	const viteConfigFile = path.join(cwd, "vite.config.ts");
	const viteConfigContent = fs.readFileSync(viteConfigFile, "utf8");

	assert.equal(
		viteConfigContent,
		`import styleframe from "styleframe/plugin/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), styleframe()],
});`,
	);
}

export function addStyleframeConfig(cwd: string, projectDir: string) {
	const fixturesDir = path.join(cwd, "src/fixtures");

	fs.copyFileSync(
		`${fixturesDir}/styleframe.config.ts`,
		`${projectDir}/styleframe.config.ts`,
	);

	fs.copyFileSync(
		`${fixturesDir}/vite.config.ts`,
		`${projectDir}/vite.config.ts`,
	);

	shell.cp("-R", `${fixturesDir}/src/*`, `${projectDir}/src/`);
}

export function buildVite(cwd: string) {
	shell.exec(`npx vite build`, {
		cwd,
	});
}

export function runPlaywright(cwd: string, projectDir: string) {
	shell.exec(`pnpm exec playwright test`, {
		cwd,
		env: {
			...process.env,
			PROJECT_DIR: projectDir,
			CI: "true",
		},
	});
}

export function cleanup(dirs: Array<string>) {
	dirs.forEach((dir) => {
		shell.exec(`rm -rf ${dir}`);
	});
}
