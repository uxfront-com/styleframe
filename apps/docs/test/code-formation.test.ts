import { composeParticleShader } from "@uxfront/scene";
import type { FormationFrame, Uniforms } from "@uxfront/scene";
import { afterEach, describe, expect, it, vi } from "vitest";
import { codeBlock } from "../app/lib/formations";
import {
	REVEAL_PROPERTY,
	createShader,
	gatherOf,
	revealOf,
} from "../app/lib/formations/code.shader";

describe("gatherOf and revealOf", () => {
	// The engine moves particles into the formation until approach 1.
	it.each([0, 0.5, 0.7, 0.9, 0.999])(
		"keeps the code hidden while the morph is under way (approach %f)",
		(approach) => {
			expect(gatherOf(approach)).toBeLessThan(1);
			expect(revealOf(approach, 1, 0.1)).toBe(0);
		},
	);

	it("fades the code in over the start of the hold", () => {
		expect(gatherOf(1)).toBe(1);
		expect(revealOf(1, 0, 0.1)).toBe(0);
		expect(revealOf(1, 0.05, 0.1)).toBeGreaterThan(0);
		expect(revealOf(1, 0.05, 0.1)).toBeLessThan(1);
		expect(revealOf(1, 0.1, 0.1)).toBe(1);
		expect(revealOf(1, 0.6, 0.1)).toBe(1);
	});

	it("shows the code at approach 1 when the section has no hold", () => {
		expect(revealOf(1, 0, 0)).toBe(1);
	});
});

describe("createShader", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	// A section whose stage starts 1000px down the page and is 1200px tall, on
	// a 900px screen, with a panel 300px down; only as much DOM as the shader
	// reads. Its hold runs from 775 to 1525: 750px, so the 72px fade (8% of
	// the screen) takes 0.096 of it.
	const stubPage = () => {
		const props = new Map<string, string>();
		const makePanel = () => ({
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
		});
		let panel = makePanel();
		const stage = {
			getBoundingClientRect: () => ({ top: 1000 - page.scrollY, height: 1200 }),
		};
		const page = { scrollY: 0, innerHeight: 900 };
		vi.stubGlobal("window", page);
		vi.stubGlobal("document", {
			documentElement: { scrollHeight: 5000 },
			getElementById: () => ({
				isConnected: true,
				querySelector: (selector: string) =>
					selector === "[data-stage]" ? stage : panel,
			}),
			querySelector: () => ({ clientWidth: 1440, clientHeight: 900 }),
		});
		const rects: number[][] = [];
		const uniforms = {
			gl: {
				uniform1f: () => {},
				uniform2f: () => {},
				uniform4f: (_: unknown, ...rect: number[]) => rects.push(rect),
			},
			get: (name: string) => name,
		} as unknown as Uniforms;
		const replacePanel = () => {
			panel = makePanel();
			return panel;
		};
		return { panel, props, page, rects, uniforms, replacePanel };
	};

	const frame = (approach: number, local = 0) =>
		({
			stage: 1,
			local,
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

	it("puts the gather on the panel and reveals the code after the morph", () => {
		const { panel, props, uniforms } = stubPage();
		const shader = createShader("config");
		shader.update?.(uniforms, frame(0.99));
		expect(panel.dataset.gather).toBe("0.990");
		expect(props.get(REVEAL_PROPERTY)).toBe("0.000");
		shader.update?.(uniforms, frame(1, 0));
		expect(panel.dataset.gather).toBe("1.000");
		expect(props.get(REVEAL_PROPERTY)).toBe("0.000");
		shader.update?.(uniforms, frame(1, 0.048));
		expect(Number(props.get(REVEAL_PROPERTY))).toBeGreaterThan(0);
		expect(Number(props.get(REVEAL_PROPERTY))).toBeLessThan(1);
		shader.update?.(uniforms, frame(1, 0.096));
		expect(props.get(REVEAL_PROPERTY)).toBe("1.000");
	});

	it("writes the gather again on a panel the page re-rendered", () => {
		const { page, uniforms, replacePanel } = stubPage();
		const listeners: (() => void)[] = [];
		Object.assign(page, {
			addEventListener: (_: string, listener: () => void) =>
				listeners.push(listener),
		});
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe() {}
			},
		);
		const shader = createShader("config");
		shader.setup?.({} as Uniforms);
		shader.update?.(uniforms, frame(1, 1));
		const next = replacePanel();
		for (const listener of listeners) listener();
		shader.update?.(uniforms, frame(1, 1));
		expect(next.dataset.gather).toBe("1.000");
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
