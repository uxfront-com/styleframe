// @vitest-environment jsdom
import type { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	createEditor,
	getEditorSelection,
	languageForPath,
	setEditorValue,
} from "@/editor/codemirror";

const openEditors: Array<EditorView> = [];

function mount(
	overrides: Partial<Parameters<typeof createEditor>[0]> = {},
): EditorView {
	const parent = document.createElement("div");
	document.body.append(parent);
	const view = createEditor({
		parent,
		doc: "const x = 1;",
		language: "typescript",
		...overrides,
	});
	openEditors.push(view);
	return view;
}

afterEach(() => {
	while (openEditors.length > 0) {
		openEditors.pop()?.destroy();
	}
	document.body.replaceChildren();
});

describe("createEditor", () => {
	it("mounts a CodeMirror view into the provided parent", () => {
		const parent = document.createElement("div");
		document.body.append(parent);
		const view = createEditor({
			parent,
			doc: "hello",
			language: "typescript",
		});
		openEditors.push(view);

		expect(parent.querySelector(".cm-content")).not.toBeNull();
	});

	it("initialises the document from the doc option", () => {
		const view = mount({ doc: "const answer = 42;" });
		expect(view.state.doc.toString()).toBe("const answer = 42;");
	});

	it("invokes onChange when the document changes", () => {
		const onChange = vi.fn();
		const view = mount({ doc: "", onChange });

		view.dispatch({ changes: { from: 0, insert: "hi" } });

		expect(onChange).toHaveBeenCalledWith("hi");
	});

	it("marks the editor state as read-only when readOnly is true", () => {
		const writable = mount({ readOnly: false });
		const locked = mount({ readOnly: true });

		expect(writable.state.readOnly).toBe(false);
		expect(locked.state.readOnly).toBe(true);
	});

	it("selects different language extensions for tsx and typescript", () => {
		const ts = mount({ language: "typescript" });
		const tsx = mount({ language: "tsx" });

		expect(ts.state).not.toBe(tsx.state);
		expect(ts.state.doc.toString()).toBe("const x = 1;");
		expect(tsx.state.doc.toString()).toBe("const x = 1;");
	});
});

describe("languageForPath", () => {
	it("maps file extensions to editor languages", () => {
		expect(languageForPath("styles.css")).toBe("css");
		expect(languageForPath("App.tsx")).toBe("tsx");
		expect(languageForPath("Widget.jsx")).toBe("tsx");
		expect(languageForPath("config.ts")).toBe("typescript");
		// Extensionless paths fall back to TypeScript.
		expect(languageForPath("README")).toBe("typescript");
	});
});

describe("getEditorSelection", () => {
	it("reports the 1-based line and column of the cursor", () => {
		const view = mount({ doc: "ab\ncd" });
		// Position 4 is the second column of the second line ("c|d").
		view.dispatch({ selection: { anchor: 4 } });

		expect(getEditorSelection(view)).toEqual({ line: 2, column: 2 });
	});

	it("invokes onSelectionChange when the selection moves", () => {
		const onSelectionChange = vi.fn();
		const view = mount({ doc: "hello", onSelectionChange });
		onSelectionChange.mockClear();

		view.dispatch({ selection: { anchor: 3 } });

		expect(onSelectionChange).toHaveBeenCalledWith({ line: 1, column: 4 });
	});
});

describe("setEditorValue", () => {
	it("dispatches a replacement when the value differs", () => {
		const view = mount({ doc: "old" });
		const spy = vi.spyOn(view, "dispatch");

		setEditorValue(view, "new");

		expect(spy).toHaveBeenCalledTimes(1);
		expect(view.state.doc.toString()).toBe("new");
	});

	it("does not dispatch when the value is unchanged", () => {
		const view = mount({ doc: "same" });
		const spy = vi.spyOn(view, "dispatch");

		setEditorValue(view, "same");

		expect(spy).not.toHaveBeenCalled();
	});
});
