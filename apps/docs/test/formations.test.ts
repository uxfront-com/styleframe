import { describe, expect, it } from "vitest";
import { codeBlock, device, empty } from "../app/lib/formations";

describe("formations", () => {
	it("gives the code and device formations their own keys", () => {
		const keys = [
			empty({ label: "Empty" }),
			codeBlock({ key: "config", label: "One config" }),
			codeBlock({ key: "themes", label: "Themes" }),
			device({ label: "Fluid design" }),
		].map((formation) => formation.key);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it("labels them for the HUD", () => {
		expect(codeBlock({ key: "config", label: "One config" }).label).toBe(
			"One config",
		);
		expect(device({ label: "Fluid design" }).label).toBe("Fluid design");
	});
});
