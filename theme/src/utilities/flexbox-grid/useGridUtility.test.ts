import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useGridTemplateColumnsUtility,
	useGridColumnUtility,
	useGridColumnStartUtility,
	useGridColumnEndUtility,
	useGridTemplateRowsUtility,
	useGridRowUtility,
	useGridRowStartUtility,
	useGridRowEndUtility,
	useGridAutoFlowUtility,
	useGridAutoColumnsUtility,
	useGridAutoRowsUtility,
} from "./useGridUtility";

describe("useGridTemplateColumnsUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useGridTemplateColumnsUtility(s, {
			"1": "repeat(1, minmax(0, 1fr))",
			"2": "repeat(2, minmax(0, 1fr))",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "grid-template-columns",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useGridTemplateColumnsUtility(s, { "3": "repeat(3, minmax(0, 1fr))" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridTemplateColumnsUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-template-columns\:none {`);
		expect(css).toContain("grid-template-columns: none;");
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useGridTemplateColumnsUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useGridColumnUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridColumnUtility(s, { "span-2": "span 2 / span 2" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridColumn: "span 2 / span 2" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridColumnUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-column\:auto {`);
		expect(css).toContain("grid-column: auto;");
	});
});

describe("useGridColumnStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridColumnStartUtility(s, { "1": "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridColumnStart: "1" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridColumnStartUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-column-start\:auto {`);
		expect(css).toContain("grid-column-start: auto;");
	});
});

describe("useGridColumnEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridColumnEndUtility(s, { "3": "3" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridColumnEnd: "3" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridColumnEndUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-column-end\:auto {`);
		expect(css).toContain("grid-column-end: auto;");
	});
});

describe("useGridTemplateRowsUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridTemplateRowsUtility(s, { "3": "repeat(3, minmax(0, 1fr))" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			gridTemplateRows: "repeat(3, minmax(0, 1fr))",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridTemplateRowsUtility(s, { none: "none" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-template-rows\:none {`);
		expect(css).toContain("grid-template-rows: none;");
	});
});

describe("useGridRowUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridRowUtility(s, { "span-2": "span 2 / span 2" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridRow: "span 2 / span 2" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridRowUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-row\:auto {`);
		expect(css).toContain("grid-row: auto;");
	});
});

describe("useGridRowStartUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridRowStartUtility(s, { "1": "1" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridRowStart: "1" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridRowStartUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-row-start\:auto {`);
		expect(css).toContain("grid-row-start: auto;");
	});
});

describe("useGridRowEndUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridRowEndUtility(s, { "3": "3" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridRowEnd: "3" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridRowEndUtility(s, { auto: "auto" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-row-end\:auto {`);
		expect(css).toContain("grid-row-end: auto;");
	});
});

describe("useGridAutoFlowUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridAutoFlowUtility(s, { col: "column" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridAutoFlow: "column" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridAutoFlowUtility(s, { dense: "dense" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-auto-flow\:dense {`);
		expect(css).toContain("grid-auto-flow: dense;");
	});

	it("should handle compound values", () => {
		const s = styleframe();
		useGridAutoFlowUtility(s, { "row-dense": "row dense" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridAutoFlow: "row dense" });
	});

	it("should support the full-word column alias", () => {
		const s = styleframe();
		useGridAutoFlowUtility(s, { column: "column" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridAutoFlow: "column" });
	});
});

describe("useGridAutoColumnsUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridAutoColumnsUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridAutoColumns: "auto" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridAutoColumnsUtility(s, { fr: "minmax(0, 1fr)" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-auto-columns\:fr {`);
		expect(css).toContain("grid-auto-columns: minmax(0, 1fr);");
	});
});

describe("useGridAutoRowsUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useGridAutoRowsUtility(s, { auto: "auto" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ gridAutoRows: "auto" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGridAutoRowsUtility(s, { min: "min-content" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._grid-auto-rows\:min {`);
		expect(css).toContain("grid-auto-rows: min-content;");
	});
});
