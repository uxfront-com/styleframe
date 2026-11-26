import { reactive, readonly } from "vue";
import type { ScanResult } from "@/pipeline/scanAndRegisterUtilities";
import configSample from "@/samples/styleframe.config.sample.ts?raw";
import appSample from "@/samples/App.sample.tsx?raw";
import appStyleframeSample from "@/samples/App.styleframe.sample.ts?raw";
import avatarSample from "@/samples/Avatar.sample.tsx?raw";
import avatarStyleframeSample from "@/samples/Avatar.styleframe.sample.ts?raw";
import badgeSample from "@/samples/Badge.sample.tsx?raw";
import badgeStyleframeSample from "@/samples/Badge.styleframe.sample.ts?raw";
import buttonSample from "@/samples/Button.sample.tsx?raw";
import buttonStyleframeSample from "@/samples/Button.styleframe.sample.ts?raw";
import calloutSample from "@/samples/Callout.sample.tsx?raw";
import calloutStyleframeSample from "@/samples/Callout.styleframe.sample.ts?raw";
import cardSample from "@/samples/Card.sample.tsx?raw";
import cardStyleframeSample from "@/samples/Card.styleframe.sample.ts?raw";
import checkboxSample from "@/samples/Checkbox.sample.tsx?raw";
import checkboxStyleframeSample from "@/samples/Checkbox.styleframe.sample.ts?raw";
import inputSample from "@/samples/Input.sample.tsx?raw";
import inputStyleframeSample from "@/samples/Input.styleframe.sample.ts?raw";
import spinnerSample from "@/samples/Spinner.sample.tsx?raw";
import spinnerStyleframeSample from "@/samples/Spinner.styleframe.sample.ts?raw";

/** The file that exports the Styleframe instance as its default export. */
export const CONFIG_PATH = "styleframe.config.ts";
/** The preview entry — its default export is rendered as the root component. */
export const ENTRY_PATH = "src/App.tsx";

export type OutputId = "preview" | "css" | "js";

interface PlaygroundState {
	files: Record<string, string>;
	/** Explicit folders that may not yet contain any files. */
	folders: Array<string>;
	lastBuiltFiles: Record<string, string>;
	/** Paths of the files with an open editor tab, in tab order. */
	openPaths: Array<string>;
	activePath: string;
	activeOutput: OutputId;
	output: {
		css: string;
		runtimeTs: string;
		srcdoc: string;
	};
	scan: ScanResult | null;
	error: string | null;
}

const initialFiles: Record<string, string> = {
	[CONFIG_PATH]: configSample,
	"src/App.tsx": appSample,
	"src/App.styleframe.ts": appStyleframeSample,
	"src/components/Avatar/Avatar.tsx": avatarSample,
	"src/components/Avatar/Avatar.styleframe.ts": avatarStyleframeSample,
	"src/components/Badge/Badge.tsx": badgeSample,
	"src/components/Badge/Badge.styleframe.ts": badgeStyleframeSample,
	"src/components/Button/Button.tsx": buttonSample,
	"src/components/Button/Button.styleframe.ts": buttonStyleframeSample,
	"src/components/Callout/Callout.tsx": calloutSample,
	"src/components/Callout/Callout.styleframe.ts": calloutStyleframeSample,
	"src/components/Card/Card.tsx": cardSample,
	"src/components/Card/Card.styleframe.ts": cardStyleframeSample,
	"src/components/Checkbox/Checkbox.tsx": checkboxSample,
	"src/components/Checkbox/Checkbox.styleframe.ts": checkboxStyleframeSample,
	"src/components/Input/Input.tsx": inputSample,
	"src/components/Input/Input.styleframe.ts": inputStyleframeSample,
	"src/components/Spinner/Spinner.tsx": spinnerSample,
	"src/components/Spinner/Spinner.styleframe.ts": spinnerStyleframeSample,
};

const state = reactive<PlaygroundState>({
	files: { ...initialFiles },
	folders: [],
	lastBuiltFiles: { ...initialFiles },
	openPaths: [CONFIG_PATH],
	activePath: CONFIG_PATH,
	activeOutput: "preview",
	output: {
		css: "",
		runtimeTs: "",
		srcdoc: "",
	},
	scan: null,
	error: null,
});

export function usePlaygroundState() {
	return state;
}

export function usePlaygroundSnapshot() {
	return readonly(state);
}

/** Strip leading `./` and `/`, trim, and collapse redundant separators. */
export function normalizePath(path: string): string {
	return path
		.trim()
		.replace(/^\.?\//, "")
		.replaceAll(/\/{2,}/g, "/")
		.replaceAll(/^\/+|\/+$/g, "");
}

/** All directory prefixes implied by the current file paths. */
function derivedFolders(): Set<string> {
	const dirs = new Set<string>();
	for (const filePath of Object.keys(state.files)) {
		const parts = filePath.split("/");
		for (let i = 1; i < parts.length; i++) {
			dirs.add(parts.slice(0, i).join("/"));
		}
	}
	return dirs;
}

function pascalCase(path: string): string {
	const base =
		path
			.split("/")
			.pop()
			?.replace(/\.\w+$/, "") ?? "Component";
	const name = base
		.replaceAll(/[^A-Za-z0-9]+/g, " ")
		.trim()
		.split(/\s+/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
	return /^[A-Za-z]/.test(name) ? name : `Component${name}`;
}

function defaultContentFor(path: string): string {
	if (path.endsWith(".css")) {
		return "";
	}
	if (path.endsWith(".styleframe.ts")) {
		return `import { styleframe } from "virtual:styleframe";\n\nconst s = styleframe();\n\nexport default s;\n`;
	}
	if (path.endsWith(".tsx")) {
		const name = pascalCase(path);
		return `export default function ${name}() {\n\treturn <div className="_padding:md">${name}</div>;\n}\n`;
	}
	return "";
}

/**
 * Add a new empty file (seeded with a minimal template for `.tsx` /
 * `.styleframe.ts`) and focus it. Returns `false` if the path is blank or
 * already exists.
 */
export function createFile(path: string): boolean {
	const clean = normalizePath(path);
	if (!clean || clean in state.files) {
		return false;
	}
	state.files[clean] = defaultContentFor(clean);
	openFile(clean);
	return true;
}

/** Add an explicit (possibly empty) folder. Returns `false` if it exists. */
export function createFolder(path: string): boolean {
	const clean = normalizePath(path);
	if (!clean || state.folders.includes(clean) || derivedFolders().has(clean)) {
		return false;
	}
	state.folders = [...state.folders, clean];
	return true;
}

/** Rename a file, preserving its content and (when active) the selection. */
export function renameFile(from: string, to: string): boolean {
	const clean = normalizePath(to);
	if (!clean || from === CONFIG_PATH || from === ENTRY_PATH) {
		return false;
	}
	if (!(from in state.files) || clean in state.files) {
		return false;
	}
	const next: Record<string, string> = {};
	for (const [key, value] of Object.entries(state.files)) {
		next[key === from ? clean : key] = value;
	}
	state.files = next;
	state.openPaths = state.openPaths.map((p) => (p === from ? clean : p));
	if (state.activePath === from) {
		state.activePath = clean;
	}
	return true;
}

/** Delete a file. The config and entry files are protected. */
export function deleteFile(path: string): boolean {
	if (path === CONFIG_PATH || path === ENTRY_PATH) {
		return false;
	}
	if (!(path in state.files)) {
		return false;
	}
	delete state.files[path];
	closeFile(path);
	return true;
}

/**
 * Delete a folder and everything under it. Folders containing the config or
 * entry file are protected.
 */
export function deleteFolder(path: string): boolean {
	const clean = normalizePath(path);
	if (!clean) {
		return false;
	}
	const prefix = `${clean}/`;
	if (
		CONFIG_PATH === clean ||
		CONFIG_PATH.startsWith(prefix) ||
		ENTRY_PATH === clean ||
		ENTRY_PATH.startsWith(prefix)
	) {
		return false;
	}
	for (const filePath of Object.keys(state.files)) {
		if (filePath.startsWith(prefix)) {
			delete state.files[filePath];
		}
	}
	state.folders = state.folders.filter(
		(folder) => folder !== clean && !folder.startsWith(prefix),
	);
	const wasActiveUnder = state.activePath.startsWith(prefix);
	state.openPaths = state.openPaths.filter((p) => !p.startsWith(prefix));
	if (wasActiveUnder) {
		state.activePath = state.openPaths[0] ?? "";
	}
	return true;
}

export function setActivePath(path: string): void {
	if (path in state.files) {
		state.activePath = path;
	}
}

/** Open a file in a new tab (or focus its existing tab) and activate it. */
export function openFile(path: string): void {
	if (!(path in state.files)) {
		return;
	}
	if (!state.openPaths.includes(path)) {
		state.openPaths = [...state.openPaths, path];
	}
	state.activePath = path;
}

/**
 * Close a file's tab. If it was active, activate the neighbouring tab (or
 * none if it was the last). The file itself is not deleted.
 */
export function closeFile(path: string): void {
	const index = state.openPaths.indexOf(path);
	if (index === -1) {
		return;
	}
	state.openPaths = state.openPaths.filter((p) => p !== path);
	if (state.activePath === path) {
		state.activePath =
			state.openPaths[index] ?? state.openPaths[index - 1] ?? "";
	}
}
