import consola from "consola";
import { defineCommand } from "citty";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileExists, parseJsonc } from "../utils";
import { initializeViteFrameworkFile } from "./init/vite";
import { initializeNuxtFrameworkFile } from "./init/nuxt";
import { DOCS_INSTALLATION_CUSTOM_URL } from "../constants";

const styleframeConfigTemplate = `import { styleframe } from "styleframe";

const s = styleframe();

s.variable("color--primary", "blue");

export default s;
`;

const VIRTUAL_STYLEFRAME_MODULE = "virtual:styleframe";
const STYLEFRAME_TYPES_PATH = "./.styleframe/styleframe.d.ts";

const styleframePaths: Record<string, Array<string>> = {
	[VIRTUAL_STYLEFRAME_MODULE]: [STYLEFRAME_TYPES_PATH],
};

const styleframeIncludes = [
	"styleframe.config.ts",
	"*.styleframe.ts",
	".styleframe/**/*.d.ts",
];

interface TsConfigOptions {
	/**
	 * Whether to add a `compilerOptions.paths` entry mapping `virtual:styleframe`
	 * to `styleframe.d.ts`. Required for type-checkers that cannot resolve a
	 * bare-specifier ambient `declare module` (e.g. `vue-tsc` inside `.vue` SFCs).
	 * When false, both virtual modules resolve from the ambient `shims.d.ts`
	 * (picked up via the includes) with zero extra config.
	 */
	paths: boolean;
}

function buildTsconfigTemplate(options: TsConfigOptions) {
	return {
		compilerOptions: {
			target: "ES2022",
			module: "ESNext",
			moduleResolution: "bundler",
			strict: true,
			noEmit: true,
			skipLibCheck: true,
			esModuleInterop: true,
			...(options.paths ? { paths: styleframePaths } : {}),
		},
		include: styleframeIncludes,
	};
}

/**
 * Detects whether the project at `cwd` uses a type-checker that requires a
 * `compilerOptions.paths` entry for the `virtual:styleframe` virtual module.
 *
 * Currently this means Vue (`vue-tsc` won't resolve a bare-specifier ambient
 * `declare module` imported inside a `.vue` SFC). Detection checks for `vue` in
 * package.json dependencies and excludes Nuxt: the Nuxt module already injects
 * the mapping into Nuxt's generated tsconfig via `prepare:types`, and writing
 * `paths` into an `extends`-based root tsconfig would replace (not merge) Nuxt's
 * inherited aliases.
 */
async function needsExplicitPaths(cwd: string): Promise<boolean> {
	const packageJsonPath = path.join(cwd, "package.json");
	if (!(await fileExists(packageJsonPath))) {
		return false;
	}

	try {
		const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
		const deps = {
			...packageJson.dependencies,
			...packageJson.devDependencies,
		};
		return "vue" in deps && !("nuxt" in deps);
	} catch {
		return false;
	}
}

export async function initializeConfigFile(cwd: string) {
	const styleframeConfigPath = path.join(cwd, "styleframe.config.ts");

	if (await fileExists(styleframeConfigPath)) {
		consola.warn(
			`Skipped creating "styleframe.config.ts" because it already exists.`,
		);
	} else {
		await writeFile(styleframeConfigPath, styleframeConfigTemplate);
		consola.success(`Created "styleframe.config.ts".`);
	}
}

/**
 * Merges the `virtual:styleframe` paths entry into `compilerOptions.paths`,
 * creating `compilerOptions`/`paths` if absent and preserving existing entries.
 * Returns true if the entry was added, false if it was already mapped (so a
 * user's own override is never clobbered).
 */
function addStyleframePaths(config: Record<string, unknown>): boolean {
	const compilerOptions = (config.compilerOptions ??= {}) as Record<
		string,
		unknown
	>;
	const paths = (compilerOptions.paths ??= {}) as Record<string, unknown>;

	if (VIRTUAL_STYLEFRAME_MODULE in paths) {
		return false;
	}

	paths[VIRTUAL_STYLEFRAME_MODULE] = [STYLEFRAME_TYPES_PATH];
	return true;
}

export async function initializeTsConfig(
	cwd: string,
	options: TsConfigOptions,
) {
	const tsconfigPath = path.join(cwd, "tsconfig.json");

	if (await fileExists(tsconfigPath)) {
		const existingConfig = parseJsonc(
			await readFile(tsconfigPath, "utf8"),
		) as Record<string, unknown>;

		const added: Array<string> = [];

		// Type-checkers that cannot resolve a bare-specifier ambient module
		// (e.g. vue-tsc inside .vue SFCs) need an explicit paths entry mapping
		// `virtual:styleframe` to the generated declarations. The entry merges
		// into the consumer's own paths and degrades gracefully until the types
		// are generated. Other type-checkers resolve from the ambient shims.d.ts
		// (added via the includes below), so no paths entry is needed.
		if (options.paths && addStyleframePaths(existingConfig)) {
			added.push(`paths "${VIRTUAL_STYLEFRAME_MODULE}"`);
		}

		// Add styleframe includes if not present
		const includes = (existingConfig.include ??= []) as Array<string>;
		for (const pattern of styleframeIncludes) {
			if (!includes.includes(pattern)) {
				includes.push(pattern);
				added.push(`"${pattern}"`);
			}
		}

		if (added.length > 0) {
			await writeFile(tsconfigPath, JSON.stringify(existingConfig, null, "\t"));
			consola.success(`Added ${added.join(", ")} to tsconfig.json.`);
		}
	} else {
		await writeFile(
			tsconfigPath,
			JSON.stringify(buildTsconfigTemplate(options), null, "\t"),
		);
		consola.success(`Created "tsconfig.json".`);
	}
}

export async function addPackageJsonDependencies(cwd: string) {
	const packageJsonPath = path.join(cwd, "package.json");
	if (await fileExists(packageJsonPath)) {
		const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

		if (!packageJson.devDependencies) {
			packageJson.devDependencies = {};
		}
		Object.assign(
			packageJson.devDependencies,
			__INIT_VERSIONS__.devDependencies,
		);

		if (!packageJson.dependencies) {
			packageJson.dependencies = {};
		}
		Object.assign(packageJson.dependencies, __INIT_VERSIONS__.dependencies);

		await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

		consola.success(`Added dependencies to "package.json".`);
	} else {
		consola.warn(
			`Skipped adding styleframe to dependencies because package.json could not be found.`,
		);
	}
}

export async function initializeFrameworkFile(cwd: string) {
	if (await fileExists(path.join(cwd, "vite.config.ts"))) {
		await initializeViteFrameworkFile(cwd);
	} else if (await fileExists(path.join(cwd, "nuxt.config.ts"))) {
		await initializeNuxtFrameworkFile(cwd);
	} else {
		consola.warn(
			"No framework file detected. Read more about setting up styleframe manually.",
			DOCS_INSTALLATION_CUSTOM_URL,
		);
	}
}

export default defineCommand({
	meta: {
		name: "init",
		description: "Initialize a new styleframe project.",
	},
	args: {
		cwd: {
			type: "string",
			required: false,
			default: process.cwd(),
			description: "The directory where the project will be initialized",
			alias: ["d", "dir"],
			valueHint: "path",
		},
	},
	async run({ args }) {
		const { cwd } = args;

		consola.info("Initializing...");

		await initializeConfigFile(cwd);
		await initializeTsConfig(cwd, {
			paths: await needsExplicitPaths(cwd),
		});
		await addPackageJsonDependencies(cwd);
		await initializeFrameworkFile(cwd);
	},
});
