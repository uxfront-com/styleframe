import type { Loader, Plugin } from "esbuild-wasm";
import { getEsbuild } from "./esbuild";

export interface BundlePreviewInput {
	/** All editable files, keyed by path. */
	files: Record<string, string>;
	/** Entry file — its default export is rendered as the preview root. */
	entryPath: string;
	/** The file exporting the Styleframe instance (excluded from bundling). */
	configPath: string;
	/** Generated `virtual:styleframe` runtime module (recipe functions). */
	runtimeTs: string;
}

export interface BundlePreviewResult {
	/** The compiled preview as a single ESM module. */
	bundleJs: string;
	/** CSS emitted by any user `import './styles.css'` (usually empty). */
	css: string;
	/** IIFE that publishes React on `globalThis.PGReactVendor`. */
	reactIife: string;
}

const SOURCE_EXTENSIONS = ["", ".tsx", ".ts", ".jsx", ".js", ".css"] as const;
const INDEX_EXTENSIONS = [
	"/index.tsx",
	"/index.ts",
	"/index.jsx",
	"/index.js",
] as const;

/** Resolve a `./` or `../` import against the in-memory file map. */
function joinPath(baseDir: string, spec: string): string {
	const fromRoot = spec.startsWith("/");
	const stack = fromRoot || !baseDir ? [] : baseDir.split("/");
	for (const part of spec.split("/")) {
		if (part === "" || part === ".") {
			continue;
		}
		if (part === "..") {
			stack.pop();
		} else {
			stack.push(part);
		}
	}
	return stack.join("/");
}

function loaderFor(path: string): Loader {
	if (path.endsWith(".tsx")) {
		return "tsx";
	}
	if (path.endsWith(".ts")) {
		return "ts";
	}
	if (path.endsWith(".jsx")) {
		return "jsx";
	}
	if (path.endsWith(".css")) {
		return "css";
	}
	return "js";
}

const VENDOR_SPECIFIERS = new Set([
	"react",
	"react-dom/client",
	"react/jsx-runtime",
	"@styleframe/runtime",
	"virtual:styleframe",
	"virtual:styleframe.css",
]);

const VENDOR_GLOBALS: Record<string, string> = {
	react: "React",
	"react-dom/client": "ReactDOMClient",
	"react/jsx-runtime": "JsxRuntime",
};

/**
 * A shim module that re-exports a vendored React entry off the global the
 * vendor IIFE publishes, so the single bundled React instance is shared.
 */
function reactShim(globalKey: string, keys: Array<string>): string {
	const ref = `globalThis.PGReactVendor.${globalKey}`;
	return [
		`const mod = ${ref};`,
		"export default mod;",
		...keys.map((key) => `export const ${key} = mod[${JSON.stringify(key)}];`),
	].join("\n");
}

function createVirtualFsPlugin(
	input: BundlePreviewInput,
	vendor: {
		reactKeys: Array<string>;
		reactDomClientKeys: Array<string>;
		jsxRuntimeKeys: Array<string>;
	},
	runtimeSrc: string,
): Plugin {
	const { files, configPath, runtimeTs } = input;

	function resolveFileKey(path: string): string | null {
		for (const ext of SOURCE_EXTENSIONS) {
			if (`${path}${ext}` in files) {
				return `${path}${ext}`;
			}
		}
		for (const ext of INDEX_EXTENSIONS) {
			if (`${path}${ext}` in files) {
				return `${path}${ext}`;
			}
		}
		return null;
	}

	return {
		name: "pg-virtual-fs",
		setup(build) {
			build.onResolve({ filter: /.*/ }, (args) => {
				const spec = args.path;
				if (VENDOR_SPECIFIERS.has(spec)) {
					return { path: spec, namespace: "pg-vendor" };
				}
				if (spec.startsWith(".") || spec.startsWith("/")) {
					const importer =
						args.importer && args.importer !== "<stdin>" ? args.importer : "";
					const baseDir = importer.includes("/")
						? importer.slice(0, importer.lastIndexOf("/"))
						: "";
					const key = resolveFileKey(joinPath(baseDir, spec));
					// The config and *.styleframe.ts files are authoring-only — they
					// are evaluated in the parent, never bundled into the preview.
					if (key && key !== configPath && !key.endsWith(".styleframe.ts")) {
						return { path: key, namespace: "pg-file" };
					}
					return {
						errors: [
							{ text: `Cannot resolve "${spec}" from "${args.importer}".` },
						],
					};
				}
				return {
					errors: [
						{
							text: `Unknown import "${spec}". Create it as a file, or import recipes from "virtual:styleframe".`,
						},
					],
				};
			});

			build.onLoad({ filter: /.*/, namespace: "pg-file" }, (args) => ({
				contents: files[args.path] ?? "",
				loader: loaderFor(args.path),
				resolveDir: "/",
			}));

			build.onLoad({ filter: /.*/, namespace: "pg-vendor" }, (args) => {
				const spec = args.path;
				if (spec === "virtual:styleframe") {
					return { contents: runtimeTs, loader: "ts", resolveDir: "/" };
				}
				if (spec === "virtual:styleframe.css") {
					return { contents: "", loader: "js" };
				}
				if (spec === "@styleframe/runtime") {
					return { contents: runtimeSrc, loader: "js", resolveDir: "/" };
				}
				const globalKey = VENDOR_GLOBALS[spec]!;
				const keys =
					spec === "react"
						? vendor.reactKeys
						: spec === "react-dom/client"
							? vendor.reactDomClientKeys
							: vendor.jsxRuntimeKeys;
				return { contents: reactShim(globalKey, keys), loader: "js" };
			});
		},
	};
}

export async function bundlePreview(
	input: BundlePreviewInput,
): Promise<BundlePreviewResult> {
	const esbuild = await getEsbuild();
	const [{ default: reactVendor }, { default: runtimeSrc }] = await Promise.all(
		[import("virtual:pg-react-vendor"), import("virtual:pg-runtime-src")],
	);

	const boot = `
import { createRoot } from "react-dom/client";
import App from ${JSON.stringify(`./${input.entryPath}`)};
const notify = (detail) => parent.postMessage({ type: "pg:error", detail }, "*");
window.addEventListener("error", (event) => {
  notify({ message: event.message, stack: event.error && event.error.stack });
});
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  notify({ message: reason && reason.message ? reason.message : String(reason), stack: reason && reason.stack });
});
try {
  createRoot(document.getElementById("root")).render(<App />);
} catch (error) {
  notify({ message: error && error.message ? error.message : String(error), stack: error && error.stack });
}
`;

	const result = await esbuild.build({
		stdin: {
			contents: boot,
			resolveDir: "/",
			sourcefile: "pgBoot.tsx",
			loader: "tsx",
		},
		bundle: true,
		write: false,
		// An out dir is required for esbuild to emit CSS from user
		// `import './styles.css'`; without it such imports fail to build.
		outdir: "/",
		format: "esm",
		jsx: "automatic",
		jsxDev: false,
		target: "es2022",
		plugins: [createVirtualFsPlugin(input, reactVendor, runtimeSrc)],
	});

	// The JS bundle and any CSS from user imports are emitted as sibling
	// outputs; the CSS file is the one whose path ends in `.css`.
	const bundleJs =
		result.outputFiles.find((file) => !file.path.endsWith(".css"))?.text ?? "";
	const css = result.outputFiles
		.filter((file) => file.path.endsWith(".css"))
		.map((file) => file.text)
		.join("\n");

	return { bundleJs, css, reactIife: reactVendor.iife };
}
