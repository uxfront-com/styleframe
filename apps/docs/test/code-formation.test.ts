import {
	composeParticleShader,
	progressOf,
	sectionSpan,
	stageAt,
} from "@uxfront/scene";
import { describe, expect, it } from "vitest";
import { codeBlock } from "../app/lib/formations";
import { scrollAt } from "../app/lib/formations/code.shader";

// Three screen-tall sections on a 1000px screen, like a hero and two chapters.
// The second holds its formation from 750 to 1250, and morphs in from the
// first from 250 to 750.
const VIEWPORT = 1000;
const spans = [0, 1000, 2000].map((top) =>
	sectionSpan(top, VIEWPORT, VIEWPORT, 2000),
);

// What formation `k` sees at scroll offset `y`, as the engine hands it over.
const frameAt = (k: number, y: number) => {
	const { stage, local } = stageAt(spans, y);
	return progressOf(k, stage, local, 0);
};

describe("scrollAt", () => {
	it.each([300, 500, 700, 800, 900, 1000, 1100, 1200, 1300])(
		"finds scroll offset %i from the stage the second section sees",
		(y) => {
			expect(scrollAt(spans, 1, frameAt(1, y))).toBeCloseTo(y, 6);
		},
	);
});

describe("codeBlock", () => {
	it("loads a shader that draws and follows the panel", async () => {
		const formation = codeBlock({ key: "config", label: "One config" });
		const shader = await formation.shader();
		expect(shader.glsl).toContain("$main");
		expect(shader.update).toBeTypeOf("function");
	});

	it("composes into the particle program under its key", async () => {
		const formation = codeBlock({ key: "config", label: "One config" });
		const { glsl } = await formation.shader();
		const program = composeParticleShader([{ key: "config", glsl }]);
		expect(program).toContain("Particle config_main(");
		expect(program).toContain("uniform vec4 config_rect;");
	});
});
