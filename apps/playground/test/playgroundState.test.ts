import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	closeFile,
	CONFIG_PATH,
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
	ENTRY_PATH,
	normalizePath,
	openFile,
	renameFile,
	setActivePath,
	usePlaygroundSnapshot,
	usePlaygroundState,
} from "@/state/playground";

describe("usePlaygroundState", () => {
	beforeEach(() => {
		const state = usePlaygroundState();
		state.openPaths = [CONFIG_PATH];
		state.activePath = CONFIG_PATH;
		state.activeOutput = "preview";
		state.output.css = "";
		state.output.runtimeTs = "";
		state.output.srcdoc = "";
		state.error = null;
	});

	it("seeds the default project files and sensible defaults", () => {
		const state = usePlaygroundState();

		expect(state.files[CONFIG_PATH]!.length).toBeGreaterThan(0);
		expect(state.files["src/App.tsx"]!.length).toBeGreaterThan(0);
		expect(state.files["src/components/Card/Card.tsx"]!.length).toBeGreaterThan(0);
		expect(state.files["src/App.styleframe.ts"]).toContain(".ui-kit");
		expect(state.files["src/components/Card/Card.styleframe.ts"]).toContain("useCardRecipe");
		expect(state.files["src/components/Button/Button.styleframe.ts"]).toContain("useButtonRecipe");
		// UI-kit component samples
		expect(state.files["src/components/Badge/Badge.styleframe.ts"]).toContain("useBadgeRecipe");
		expect(state.files["src/components/Spinner/Spinner.styleframe.ts"]).toContain(
			"useSpinnerRecipe",
		);
		expect(state.files["src/components/Input/Input.tsx"]).toContain("input-field");
		expect(state.activePath).toBe(CONFIG_PATH);
		expect(state.activeOutput).toBe("preview");
		expect(state.error).toBeNull();
		// Only the config file is open by default.
		expect(state.openPaths).toEqual([CONFIG_PATH]);
	});

	it("returns the same reactive instance across calls", () => {
		expect(usePlaygroundState()).toBe(usePlaygroundState());
	});
});

describe("openFile / closeFile", () => {
	beforeEach(() => {
		const state = usePlaygroundState();
		state.openPaths = [CONFIG_PATH];
		state.activePath = CONFIG_PATH;
	});

	it("opens a file in a new tab and activates it", () => {
		const s = usePlaygroundState();
		openFile("src/App.tsx");
		expect(s.openPaths).toEqual([CONFIG_PATH, "src/App.tsx"]);
		expect(s.activePath).toBe("src/App.tsx");
	});

	it("does not duplicate an already-open tab", () => {
		const s = usePlaygroundState();
		openFile("src/App.tsx");
		openFile("src/App.tsx");
		expect(s.openPaths.filter((p) => p === "src/App.tsx")).toHaveLength(1);
	});

	it("ignores files that do not exist", () => {
		const s = usePlaygroundState();
		openFile("does/not/exist.tsx");
		expect(s.openPaths).toEqual([CONFIG_PATH]);
	});

	it("closes a tab and activates the neighbour", () => {
		const s = usePlaygroundState();
		openFile("src/App.tsx");
		expect(s.activePath).toBe("src/App.tsx");
		closeFile("src/App.tsx");
		expect(s.openPaths).toEqual([CONFIG_PATH]);
		expect(s.activePath).toBe(CONFIG_PATH);
	});

	it("leaves nothing active when the last tab is closed", () => {
		const s = usePlaygroundState();
		closeFile(CONFIG_PATH);
		expect(s.openPaths).toEqual([]);
		expect(s.activePath).toBe("");
	});

	it("closing an inactive tab keeps the active file", () => {
		const s = usePlaygroundState();
		openFile("src/App.tsx"); // active = App.tsx
		s.activePath = CONFIG_PATH; // switch the active tab back to the config
		closeFile("src/App.tsx");
		expect(s.activePath).toBe(CONFIG_PATH);
		expect(s.openPaths).toEqual([CONFIG_PATH]);
	});
});

describe("createFile", () => {
	it("adds a templated file and focuses it", () => {
		const state = usePlaygroundState();
		expect(createFile("Badge.tsx")).toBe(true);
		expect(state.files["Badge.tsx"]).toContain("Badge");
		expect(state.activePath).toBe("Badge.tsx");
		deleteFile("Badge.tsx");
	});

	it("normalizes the path and rejects blanks and duplicates", () => {
		expect(createFile("./Widget.tsx")).toBe(true);
		expect(state().files["Widget.tsx"]).toBeDefined();
		expect(createFile("Widget.tsx")).toBe(false);
		expect(createFile("   ")).toBe(false);
		deleteFile("Widget.tsx");
	});

	it("seeds non-template files with empty content", () => {
		const s = usePlaygroundState();
		// A plain `.ts` (non-`.styleframe.ts`) file gets no template.
		expect(createFile("src/helpers/format.ts")).toBe(true);
		expect(s.files["src/helpers/format.ts"]).toBe("");
		// `.css` files are likewise empty.
		expect(createFile("src/helpers/reset.css")).toBe(true);
		expect(s.files["src/helpers/reset.css"]).toBe("");
		deleteFile("src/helpers/format.ts");
		deleteFile("src/helpers/reset.css");
	});

	it("prefixes a component name that does not start with a letter", () => {
		const s = usePlaygroundState();
		expect(createFile("9lives.tsx")).toBe(true);
		expect(s.files["9lives.tsx"]).toContain("function Component9lives");
		deleteFile("9lives.tsx");
	});

	function state() {
		return usePlaygroundState();
	}
});

describe("setActivePath", () => {
	it("activates an existing file and ignores unknown paths", () => {
		const s = usePlaygroundState();
		setActivePath("src/App.tsx");
		expect(s.activePath).toBe("src/App.tsx");

		setActivePath("does/not/exist.tsx");
		expect(s.activePath).toBe("src/App.tsx");
	});
});

describe("renameFile", () => {
	it("moves content and protects the config and entry files", () => {
		const s = usePlaygroundState();
		createFile("Old.tsx");
		s.files["Old.tsx"] = "export default 1;";

		expect(renameFile("Old.tsx", "New.tsx")).toBe(true);
		expect(s.files["Old.tsx"]).toBeUndefined();
		expect(s.files["New.tsx"]).toBe("export default 1;");

		expect(renameFile(CONFIG_PATH, "nope.ts")).toBe(false);
		expect(renameFile(ENTRY_PATH, "nope.tsx")).toBe(false);
		deleteFile("New.tsx");
	});
});

describe("deleteFile", () => {
	it("removes a file and protects the config and entry files", () => {
		const s = usePlaygroundState();
		createFile("Temp.tsx");
		s.activePath = "Temp.tsx";

		expect(deleteFile("Temp.tsx")).toBe(true);
		expect(s.files["Temp.tsx"]).toBeUndefined();
		// Deleting the active file falls back to the config.
		expect(s.activePath).toBe(CONFIG_PATH);

		expect(deleteFile(CONFIG_PATH)).toBe(false);
		expect(deleteFile(ENTRY_PATH)).toBe(false);
	});

	it("seeds new *.styleframe.ts files with the extension template", () => {
		const s = usePlaygroundState();
		expect(createFile("src/components/Demo/Demo.styleframe.ts")).toBe(true);
		expect(s.files["src/components/Demo/Demo.styleframe.ts"]).toContain(
			'from "virtual:styleframe"',
		);
		deleteFile("src/components/Demo/Demo.styleframe.ts");
	});
});

describe("createFolder", () => {
	it("adds an empty folder and rejects existing ones", () => {
		const s = usePlaygroundState();
		expect(createFolder("src/components/Empty")).toBe(true);
		expect(s.folders).toContain("src/components/Empty");
		// Already explicit:
		expect(createFolder("src/components/Empty")).toBe(false);
		// Already derived from a file path:
		expect(createFolder("src/components")).toBe(false);
		expect(createFolder("  ")).toBe(false);
		s.folders = s.folders.filter((f) => f !== "src/components/Empty");
	});
});

describe("deleteFolder", () => {
	it("removes a folder with its files and protects the entry folder", () => {
		const s = usePlaygroundState();
		createFile("src/widgets/Spinner/Spinner.tsx");
		createFile("src/widgets/Spinner/Spinner.styleframe.ts");

		expect(deleteFolder("src/widgets")).toBe(true);
		expect(s.files["src/widgets/Spinner/Spinner.tsx"]).toBeUndefined();
		expect(s.files["src/widgets/Spinner/Spinner.styleframe.ts"]).toBeUndefined();

		// The entry file lives under src/, so that folder is protected.
		expect(deleteFolder("src")).toBe(false);
		expect(s.files[ENTRY_PATH]).toBeDefined();
	});

	it("prunes explicit folders nested under the deleted folder", () => {
		const s = usePlaygroundState();
		createFile("src/blocks/Hero/Hero.tsx");
		createFolder("src/blocks/empty");

		expect(deleteFolder("src/blocks")).toBe(true);
		expect(s.files["src/blocks/Hero/Hero.tsx"]).toBeUndefined();
		expect(s.folders).not.toContain("src/blocks/empty");
	});

	it("rejects a blank folder path", () => {
		expect(deleteFolder("   ")).toBe(false);
	});
});

describe("normalizePath", () => {
	it("strips leading ./ and surrounding slashes", () => {
		expect(normalizePath("./Foo.tsx")).toBe("Foo.tsx");
		expect(normalizePath("/a/b.tsx")).toBe("a/b.tsx");
		expect(normalizePath("  Bar.tsx  ")).toBe("Bar.tsx");
		expect(normalizePath("a//b.tsx")).toBe("a/b.tsx");
	});
});

describe("usePlaygroundSnapshot", () => {
	it("reflects mutations made through the mutable handle", () => {
		usePlaygroundState().output.css = ".shared{}";
		expect(usePlaygroundSnapshot().output.css).toBe(".shared{}");
	});

	it("warns when callers try to mutate the snapshot", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
		try {
			const snapshot = usePlaygroundSnapshot();
			// @ts-expect-error — readonly on purpose
			snapshot.activePath = "App.tsx";
			expect(warn).toHaveBeenCalled();
		} finally {
			warn.mockRestore();
		}
	});
});
