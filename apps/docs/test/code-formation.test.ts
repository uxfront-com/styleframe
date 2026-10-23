import { composeParticleShader } from "@uxfront/scene";
import type { FormationFrame, Uniforms } from "@uxfront/scene";
import { afterEach, describe, expect, it, vi } from "vitest";
import { codeBlock } from "../app/lib/formations";
import {
	createShader,
	gatherOf,
	revealOf,
} from "../app/lib/formations/code.shader";

describe("gatherOf and revealOf", () => {
	it.each([0, 0.2, 0.5, 0.69])(
		"keeps the code hidden while the particles gather (approach %f)",
		(approach) => {
			expect(gatherOf(approach)).toBeLessThan(1);
			expect(revealOf(approach)).toBe(0);
		},
	);

	it("fades the code in once the particles have gathered", () => {
		expect(gatherOf(0.7)).toBe(1);
		expect(revealOf(0.7)).toBe(0);
		expect(revealOf(0.85)).toBeGreaterThan(0);
		expect(revealOf(0.85)).toBeLessThan(1);
		expect(revealOf(1)).toBe(1);
	});
});

describe("createShader", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	// A panel 300px down the page, and only as much DOM as the shader reads.
	const stubPage = () => {
		const props = new Map<string, string>();
		const panel = {
			dataset: {} as Record<string, string>,
			style: {
				setProperty: (name: string, value: string) => props.set(name, value),
			},
			getBoundingClientRect: () => ({
				left: 100,
				top: 300,
				width: 400,
				height: 200,
			}),
			querySelectorAll: () => [],
			querySelector: () => null,
		};
		const page = { scrollY: 0, innerHeight: 900 };
		vi.stubGlobal("window", page);
		vi.stubGlobal("document", {
			getElementById: () => ({ querySelector: () => panel }),
			querySelector: () => ({ clientWidth: 1440, clientHeight: 900 }),
		});
		const rects: number[][] = [];
		const uniforms = {
			gl: {
				uniform2f: () => {},
				uniform4f: (_: unknown, ...rect: number[]) => rects.push(rect),
			},
			get: (name: string) => name,
		} as unknown as Uniforms;
		return { panel, props, page, rects, uniforms };
	};

	const frame = (approach: number) =>
		({
			stage: 1,
			local: 0,
			approach,
			presence: 1,
			time: 0,
			dt: 0,
			motion: true,
			scrolled: 0,
		}) as FormationFrame;

	it("keeps the outline on the panel at the scroll the page renders, whatever the scene's", () => {
		const { page, rects, uniforms } = stubPage();
		const shader = createShader("config");
		for (const [scrollY, approach] of [
			[0, 0],
			[250, 0.2],
			[1000, 0.5],
			[40, 1],
		]) {
			page.scrollY = scrollY;
			shader.update?.(uniforms, frame(approach));
			expect(rects.at(-1)).toEqual([100, 300 - scrollY, 400, 200]);
		}
	});

	it("puts the gather on the panel and reveals the code after it", () => {
		const { panel, props, uniforms } = stubPage();
		const shader = createShader("config");
		shader.update?.(uniforms, frame(0.35));
		expect(panel.dataset.gather).toBe("0.500");
		expect(props.get("--code-reveal")).toBe("0.000");
		shader.update?.(uniforms, frame(1));
		expect(panel.dataset.gather).toBe("1.000");
		expect(props.get("--code-reveal")).toBe("1.000");
	});
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
