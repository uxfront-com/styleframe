import { beforeAll, describe, expect, it, vi } from "vitest";

import { initRealEsbuild } from "./helpers/esbuild";

vi.mock("@/pipeline/esbuild", () => ({
	getEsbuild: () => initRealEsbuild(),
}));

vi.mock("virtual:pg-react-vendor", () => ({
	default: {
		iife: "globalThis.PGReactVendor = {};",
		reactKeys: ["useState"],
		reactDomClientKeys: ["createRoot"],
		jsxRuntimeKeys: ["jsx", "jsxs", "Fragment"],
	},
}));

vi.mock("virtual:pg-runtime-src", () => ({
	default: "export const createRecipe = (name) => () => name;",
}));

describe("bundlePreview", () => {
	beforeAll(async () => {
		await initRealEsbuild();
	});

	it("bundles the entry, cross-file imports, and virtual:styleframe", async () => {
		const { bundlePreview } = await import("@/pipeline/bundlePreview");

		const result = await bundlePreview({
			files: {
				"styleframe.config.ts": "export default {};",
				"App.tsx": `import Button from "./Button";\nimport { card } from "virtual:styleframe";\nexport default function App(){ return <div className={card()}><Button/></div>; }`,
				"Button.tsx": `import { button } from "virtual:styleframe";\nexport default function Button(){ return <button className={button()}>Hi</button>; }`,
			},
			entryPath: "App.tsx",
			configPath: "styleframe.config.ts",
			runtimeTs: `import { createRecipe } from "@styleframe/runtime";\nexport const card = createRecipe("card", {});\nexport const button = createRecipe("button", {});`,
		});

		// Cross-file import is inlined.
		expect(result.bundleJs).toContain("function Button");
		// React is read off the vendor global, not imported as a bare module.
		expect(result.bundleJs).toContain("PGReactVendor");
		expect(result.bundleJs).not.toMatch(/from\s*"react"/);
		// virtual:styleframe resolves to the generated runtime module.
		expect(result.bundleJs).not.toContain('"virtual:styleframe"');
		expect(result.reactIife).toBe("globalThis.PGReactVendor = {};");
	});

	it("loads every source extension and extracts user CSS", async () => {
		const { bundlePreview } = await import("@/pipeline/bundlePreview");

		const result = await bundlePreview({
			files: {
				"styleframe.config.ts": "export default {};",
				"App.tsx": [
					'import "./styles.css";',
					'import "virtual:styleframe.css";',
					'import { tsHelper } from "./helper";',
					'import { jsUtil } from "./util";',
					'import Widget from "./widget";',
					"export default function App(){ return <div>{tsHelper}{jsUtil}<Widget/></div>; }",
				].join("\n"),
				"helper.ts": 'export const tsHelper = "PG_TS_VALUE";',
				"util.js": 'export const jsUtil = "PG_JS_VALUE";',
				"widget.jsx": "export default function Widget(){ return <span>w</span>; }",
				"styles.css": ".pg-user { color: red; }",
			},
			entryPath: "App.tsx",
			configPath: "styleframe.config.ts",
			runtimeTs: "",
		});

		// The .ts, .js and .jsx modules are each loaded and inlined.
		expect(result.bundleJs).toContain("PG_TS_VALUE");
		expect(result.bundleJs).toContain("PG_JS_VALUE");
		expect(result.bundleJs).toContain("function Widget");
		// The imported .css file is extracted into the css output, while
		// virtual:styleframe.css resolves to an empty module.
		expect(result.css).toContain(".pg-user");
	});

	it("rejects an unknown bare import", async () => {
		const { bundlePreview } = await import("@/pipeline/bundlePreview");

		await expect(
			bundlePreview({
				files: {
					"App.tsx":
						'import _ from "lodash";\nexport default function App(){ return <div>{String(_)}</div>; }',
				},
				entryPath: "App.tsx",
				configPath: "styleframe.config.ts",
				runtimeTs: "",
			}),
		).rejects.toThrow();
	});

	it("rejects when a relative import cannot be resolved", async () => {
		const { bundlePreview } = await import("@/pipeline/bundlePreview");

		await expect(
			bundlePreview({
				files: {
					"App.tsx": `import X from "./missing";\nexport default function App(){ return <X />; }`,
				},
				entryPath: "App.tsx",
				configPath: "styleframe.config.ts",
				runtimeTs: "",
			}),
		).rejects.toThrow();
	});
});
