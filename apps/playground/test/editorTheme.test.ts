// @vitest-environment jsdom
import type { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it } from "vitest";
import { createEditor, setEditorTheme } from "@/editor/codemirror";
import {
	playgroundEditorThemeDark,
	playgroundEditorThemeLight,
	playgroundTheme,
} from "@/editor/theme";

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

describe("playgroundTheme", () => {
	it("returns the light editor theme and a highlight extension for 'light'", () => {
		const ext = playgroundTheme("light");
		expect(ext).toHaveLength(2);
		expect(ext[0]).toBe(playgroundEditorThemeLight);
	});

	it("returns the dark editor theme and a highlight extension for 'dark'", () => {
		const ext = playgroundTheme("dark");
		expect(ext).toHaveLength(2);
		expect(ext[0]).toBe(playgroundEditorThemeDark);
	});
});

describe("createEditor", () => {
	it("mounts a CSS document with the css language", () => {
		const view = mount({
			doc: ".btn { color: red; }",
			language: "css",
		});

		expect(view.state.doc.toString()).toBe(".btn { color: red; }");
	});
});

describe("setEditorTheme", () => {
	it("preserves document content when swapping themes", () => {
		const view = mount({ doc: "const answer = 42;", theme: "light" });

		setEditorTheme(view, "dark");
		expect(view.state.doc.toString()).toBe("const answer = 42;");

		setEditorTheme(view, "light");
		expect(view.state.doc.toString()).toBe("const answer = 42;");
	});

	it("preserves cursor selection across theme swaps", () => {
		const view = mount({ doc: "hello world", theme: "light" });
		view.dispatch({ selection: { anchor: 6, head: 11 } });

		setEditorTheme(view, "dark");

		expect(view.state.selection.main.from).toBe(6);
		expect(view.state.selection.main.to).toBe(11);
	});
});
