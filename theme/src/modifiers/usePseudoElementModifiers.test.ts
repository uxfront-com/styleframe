import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { usePseudoElementModifiers } from "./usePseudoElementModifiers";

describe("usePseudoElementModifiers", () => {
	it("should register all pseudo-element modifier factories", () => {
		const s = styleframe();
		const modifiers = usePseudoElementModifiers(s);

		expect(modifiers.before.key).toEqual(["before"]);
		expect(modifiers.after.key).toEqual(["after"]);
		expect(modifiers.placeholder.key).toEqual(["placeholder"]);
		expect(modifiers.selection.key).toEqual(["selection"]);
		expect(modifiers.firstLetter.key).toEqual(["first-letter"]);
		expect(modifiers.firstLine.key).toEqual(["first-line"]);
		expect(modifiers.marker.key).toEqual(["marker"]);
		expect(modifiers.backdrop.key).toEqual(["backdrop"]);
		expect(modifiers.file.key).toEqual(["file"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		usePseudoElementModifiers(s);

		expect(s.root.modifiers).toHaveLength(9);
	});

	it("should generate correct CSS class names for before modifier", () => {
		const s = styleframe();
		const { before } = usePseudoElementModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ red: "red" }, [before]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:red {`);
		expect(css).toContain(String.raw`._before\:background-color\:red {`);
	});

	it("should generate correct CSS class names for after modifier", () => {
		const s = styleframe();
		const { after } = usePseudoElementModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ blue: "blue" }, [after]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:blue {`);
		expect(css).toContain(String.raw`._after\:background-color\:blue {`);
	});

	it("should generate correct CSS class names for placeholder modifier", () => {
		const s = styleframe();
		const { placeholder } = usePseudoElementModifiers(s);

		const createColor = s.utility("color", ({ value }) => ({
			color: value,
		}));
		createColor({ muted: "#999" }, [placeholder]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._color\:muted {`);
		expect(css).toContain(String.raw`._placeholder\:color\:muted {`);
	});

	it("should generate correct CSS class names for selection modifier", () => {
		const s = styleframe();
		const { selection } = usePseudoElementModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ highlight: "yellow" }, [selection]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:highlight {`);
		expect(css).toContain(String.raw`._selection\:background-color\:highlight {`);
	});

	it("should generate correct CSS class names for file modifier", () => {
		const s = styleframe();
		const { file } = usePseudoElementModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ primary: "#006cff" }, [file]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:primary {`);
		expect(css).toContain(String.raw`._file\:background-color\:primary {`);
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { marker } = usePseudoElementModifiers(s);

		const createColor = s.utility("color", ({ value }) => ({
			color: value,
		}));
		createColor({ red: "red" }, [marker]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "color",
		);
		expect(utilities).toHaveLength(2);

		const markerUtility = utilities.find((u) => u.modifiers.includes("marker"));
		expect(markerUtility).toBeDefined();
	});
});
