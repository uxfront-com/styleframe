import { describe, expect, it } from "vitest";
import { device, deviceAt, empty } from "../app/lib/formations";

describe("formations", () => {
	it("gives the device formation its own key", () => {
		const keys = [
			empty({ label: "Empty" }),
			device({ label: "Fluid design" }),
		].map((formation) => formation.key);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it("labels them for the HUD", () => {
		expect(device({ label: "Fluid design" }).label).toBe("Fluid design");
	});
});

describe("device", () => {
	const widths = [0, 0.25, 0.5, 0.75, 1].map((p) => deviceAt(p).half[0]);

	it("grows from a phone to a tablet to a desktop", () => {
		const [phone, tablet, desktop] = [0, 0.5, 1].map(deviceAt);
		expect(phone.half[1]).toBeGreaterThan(phone.half[0]);
		expect(tablet.half[0]).toBeGreaterThan(phone.half[0]);
		expect(desktop.half[0]).toBeGreaterThan(desktop.half[1]);
		expect([phone.stand, desktop.stand]).toEqual([0, 1]);
		expect(widths).toEqual([...widths].sort((a, b) => a - b));
	});

	it("sizes its text with its width", () => {
		const sizes = [0, 0.25, 0.5, 0.75, 1].map((p) => deviceAt(p).type);
		expect(new Set(sizes).size).toBe(sizes.length);
		expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
	});

	it("draws in particles", async () => {
		const shader = await device({ label: "Fluid design" }).shader();
		expect(shader.glsl).toContain("$main");
		expect(shader.glsl).not.toContain("-1000.0");
	});

	it("holds one device still without motion", async () => {
		const shader = await device({ label: "Fluid design" }).shader();
		const at = (local: number, motion: boolean) => {
			const values: number[][] = [];
			const record = (_: unknown, ...v: number[]) => values.push(v);
			const gl = { uniform1f: record, uniform2f: record };
			shader.update?.(
				{ gl: gl as unknown as WebGL2RenderingContext, get: () => ({}) },
				{
					local,
					approach: 1,
					presence: 1,
					stage: 0,
					time: 0,
					dt: 0,
					motion,
					scrolled: 0,
				},
			);
			return values;
		};
		expect(at(0, false)).toEqual(at(1, false));
		expect(at(0, true)).not.toEqual(at(1, true));
	});
});
