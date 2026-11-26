import { describe, expect, it } from "vitest";

import { formatAlias, parseAlias } from "../../src/alias/parse";
import { appendPath, joinPath, splitPath } from "../../src/alias/path";

describe("parseAlias / formatAlias", () => {
	it("round-trips", () => {
		expect(parseAlias(formatAlias("color.primary"))).toBe("color.primary");
		expect(formatAlias(parseAlias("{color.primary}"))).toBe("{color.primary}");
	});
});

describe("path helpers", () => {
	it("splits and joins", () => {
		expect(splitPath("a.b.c")).toEqual(["a", "b", "c"]);
		expect(splitPath("")).toEqual([]);
		expect(joinPath(["a", "b", "c"])).toBe("a.b.c");
		expect(joinPath([])).toBe("");
	});

	it("appends children", () => {
		expect(appendPath("", "color")).toBe("color");
		expect(appendPath("color", "primary")).toBe("color.primary");
		expect(appendPath("a.b", "c")).toBe("a.b.c");
	});
});
