import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/pipeline/transformTs", () => ({
	transformTs: vi.fn(),
}));
vi.mock("@/pipeline/evalUserConfig", () => ({
	evalUserConfig: vi.fn(),
	evalStyleframeFile: vi.fn(),
}));
vi.mock("@/pipeline/transpileStyleframe", () => ({
	transpileStyleframe: vi.fn(),
}));
vi.mock("@/pipeline/scanAndRegisterUtilities", () => ({
	scanAndRegisterUtilities: vi.fn(),
}));
vi.mock("@/pipeline/bundlePreview", () => ({
	bundlePreview: vi.fn(),
}));
vi.mock("@/pipeline/buildSrcdoc", () => ({
	buildSrcdoc: vi.fn(),
}));

const input = {
	files: {
		"styleframe.config.ts": "user-config-source",
		"src/App.tsx": "export default () => null;",
		"src/components/Button/Button.tsx": "export default () => null;",
		"src/components/Button/Button.styleframe.ts": "export default s;",
	},
	configPath: "styleframe.config.ts",
	entryPath: "src/App.tsx",
};

async function loadMocks() {
	const { transformTs } = await import("@/pipeline/transformTs");
	const { evalUserConfig, evalStyleframeFile } =
		await import("@/pipeline/evalUserConfig");
	const { transpileStyleframe } =
		await import("@/pipeline/transpileStyleframe");
	const { scanAndRegisterUtilities } =
		await import("@/pipeline/scanAndRegisterUtilities");
	const { bundlePreview } = await import("@/pipeline/bundlePreview");
	const { buildSrcdoc } = await import("@/pipeline/buildSrcdoc");
	return {
		transformTs: vi.mocked(transformTs),
		evalUserConfig: vi.mocked(evalUserConfig),
		evalStyleframeFile: vi.mocked(evalStyleframeFile),
		transpileStyleframe: vi.mocked(transpileStyleframe),
		scanAndRegisterUtilities: vi.mocked(scanAndRegisterUtilities),
		bundlePreview: vi.mocked(bundlePreview),
		buildSrcdoc: vi.mocked(buildSrcdoc),
	};
}

function wireHappyPath(mocks: Awaited<ReturnType<typeof loadMocks>>) {
	mocks.transformTs.mockImplementation(async (source) => `js:${source}`);
	mocks.evalUserConfig.mockResolvedValue({} as never);
	mocks.evalStyleframeFile.mockReturnValue(undefined);
	mocks.scanAndRegisterUtilities.mockReturnValue({
		count: 0,
		registered: [],
		diagnostics: [],
	});
	mocks.transpileStyleframe.mockResolvedValue({
		css: ".cls{color:red}",
		ts: "export const cls = () => 'cls';",
	});
	mocks.bundlePreview.mockResolvedValue({
		bundleJs: "PREVIEW_BUNDLE",
		css: "",
		reactIife: "REACT_IIFE",
	});
	const revoke = vi.fn();
	mocks.buildSrcdoc.mockReturnValue({ srcdoc: "<html></html>", revoke });
	return { revoke };
}

describe("runPipeline", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("resolves with assembled output on the happy path", async () => {
		const mocks = await loadMocks();
		const { revoke } = wireHappyPath(mocks);
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(true);
		if (!result.ok) {
			return;
		}
		expect(result.css).toBe(".cls{color:red}");
		expect(result.runtimeTs).toBe("export const cls = () => 'cls';");
		expect(result.srcdoc).toBe("<html></html>");
		expect(result.scan).toEqual({ count: 0, registered: [], diagnostics: [] });
		expect(result.revoke).toBe(revoke);

		expect(mocks.transformTs).toHaveBeenCalledWith("user-config-source");
		expect(mocks.bundlePreview).toHaveBeenCalledWith({
			files: input.files,
			entryPath: "src/App.tsx",
			configPath: "styleframe.config.ts",
			runtimeTs: "export const cls = () => 'cls';",
		});
	});

	it("evaluates every *.styleframe.ts file against the instance", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		const { runPipeline } = await import("@/pipeline/pipeline");

		await runPipeline(input);

		expect(mocks.evalStyleframeFile).toHaveBeenCalledTimes(1);
		// The compiled extension source is evaluated against the config instance.
		expect(mocks.evalStyleframeFile).toHaveBeenCalledWith(
			"js:export default s;",
			{},
		);
	});

	it("scans component files but not the config or *.styleframe.ts files", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		const { runPipeline } = await import("@/pipeline/pipeline");

		await runPipeline(input);

		const sources = mocks.scanAndRegisterUtilities.mock.calls[0]![1];
		const paths = sources.map((s) => s.filePath).sort();
		expect(paths).toEqual(["src/App.tsx", "src/components/Button/Button.tsx"]);
	});

	it("returns stage 'config-transform' when the TS transform rejects", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.transformTs.mockRejectedValueOnce(new Error("bad config"));
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result).toMatchObject({ ok: false, stage: "config-transform" });
		if (result.ok) {
			return;
		}
		expect(result.error.message).toBe("bad config");
	});

	it("returns stage 'config-eval' when evalUserConfig rejects", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.evalUserConfig.mockRejectedValueOnce(new Error("no default export"));
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}
		expect(result.stage).toBe("config-eval");
	});

	it("returns stage 'styleframe' when an extension file throws", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.evalStyleframeFile.mockImplementationOnce(() => {
			throw new Error("bad extension");
		});
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}
		expect(result.stage).toBe("styleframe");
		expect(result.error.message).toBe("bad extension");
	});

	it("returns stage 'scan' when scanning throws", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.scanAndRegisterUtilities.mockImplementationOnce(() => {
			throw new Error("scan boom");
		});
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}
		expect(result.stage).toBe("scan");
	});

	it("returns stage 'transpile' when transpileStyleframe rejects", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.transpileStyleframe.mockRejectedValueOnce(new Error("transpile"));
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}
		expect(result.stage).toBe("transpile");
	});

	it("returns stage 'bundle' when bundlePreview rejects", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.bundlePreview.mockRejectedValueOnce(new Error("esbuild failed"));
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}
		expect(result.stage).toBe("bundle");
		expect(result.error.message).toBe("esbuild failed");
	});

	it("returns stage 'assemble' when buildSrcdoc throws", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.buildSrcdoc.mockImplementationOnce(() => {
			throw new Error("assemble");
		});
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}
		expect(result.stage).toBe("assemble");
	});

	it("wraps non-Error throws into Error instances", async () => {
		const mocks = await loadMocks();
		wireHappyPath(mocks);
		mocks.transformTs.mockRejectedValueOnce("boom");
		const { runPipeline } = await import("@/pipeline/pipeline");

		const result = await runPipeline(input);

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}
		expect(result.error).toBeInstanceOf(Error);
		expect(result.error.message).toBe("boom");
	});
});

describe("debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it("invokes the target after the wait elapses", async () => {
		const { debounce } = await import("@/pipeline/pipeline");
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced("a");
		expect(fn).not.toHaveBeenCalled();
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith("a");
	});

	it("collapses rapid calls into a single invocation with the last args", async () => {
		const { debounce } = await import("@/pipeline/pipeline");
		const fn = vi.fn();
		const debounced = debounce(fn, 50);

		debounced(1);
		debounced(2);
		debounced(3);

		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(3);
	});

	it("resets the timer when called again before the wait elapses", async () => {
		const { debounce } = await import("@/pipeline/pipeline");
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced("first");
		vi.advanceTimersByTime(50);
		debounced("second");
		vi.advanceTimersByTime(50);
		expect(fn).not.toHaveBeenCalled();
		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledWith("second");
	});
});
