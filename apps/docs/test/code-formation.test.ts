import { composeParticleShader, sectionSpan, stageAt } from "@uxfront/scene";
import { describe, expect, it } from "vitest";
import { codeBlock } from "../app/lib/formations";
import { scrollAt } from "../app/lib/formations/code.shader";

// Three screen-tall sections on a 1000px screen, like a hero and two chapters.
const VIEWPORT = 1000;
const spans = [0, 1000, 2000].map((top) =>
	sectionSpan(top, VIEWPORT, VIEWPORT, 2000),
);

// What formation `k` sees at scroll offset `y`, as the engine hands it over.
const frameAt = (k: number, y: number) => {
	const { stage, local } = stageAt(spans, y);
	const near = Math.abs(stage - k) < 1e-4;
	return {
		stage,
		local: near ? local : stage > k ? 1 : 0,
		approach: Math.min(1, Math.max(0, stage - k + 1)),
		presence: Math.min(1, Math.max(0, 1 - Math.abs(stage - k))),
	};
};

describe("scrollAt", () => {
	it.each([800, 900, 1000, 1100, 1200, 1300])(
		"finds scroll offset %i from the stage the second section sees",
		(y) => {
			expect(scrollAt(spans, 1, frameAt(1, y))).toBeCloseTo(y, 6);
		},
	);
});

describe("codeBlock", () => {
	it("loads its shader only when asked", async () => {
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
