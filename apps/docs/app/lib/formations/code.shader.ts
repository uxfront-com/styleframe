import { clamp, sectionSpan, smoothstep } from "@uxfront/scene";
import type { FormationShader, Uniforms } from "@uxfront/scene";

/** Lines of code the particles draw, at most: four to a `vec4`. */
const MAX_LINES = 48;

/** How far the page scrolls while the code fades in, in screen heights. */
const FADE = 0.08;

/** The custom property on the panel that SiteSplit fades the code by. */
export const REVEAL_PROPERTY = "--code-reveal";

/**
 * How far the particles have gathered into the panel, 0 → 1. The engine
 * moves them in from the formation before until `approach` reaches 1, so the
 * gather is only complete then, whatever `$main`'s own schedule.
 */
export const gatherOf = (approach: number) => clamp(approach, 0, 1);

/**
 * How far the code has faded in: nothing until the gather is complete, then
 * in over the first `span` of the section's hold (`local`).
 */
export const revealOf = (approach: number, local: number, span: number) => {
	if (approach < 1) return 0;
	return span > 0 ? smoothstep(0, span, local) : 1;
};

const glsl = /* glsl */ `
const int $MAX_LINES = ${MAX_LINES};

// The code panel in the canvas's CSS pixels: left, top, width, height.
uniform vec4 $rect;
// The canvas's size in CSS pixels.
uniform vec2 $screen;
// The code inside the panel: its left and its first line's top (from the
// panel's corner), the line height and the width of a character.
uniform vec4 $text;
// The rule under the panel's caption, from its top, and the code's width.
uniform vec2 $frame;
// How far the code has faded in (revealOf).
uniform float $reveal;
// Each line, packed as indent + 64 * length + 8192 * row, in characters and
// rows of the line height.
uniform vec4 $lines[${MAX_LINES / 4}];
uniform float $count;
uniform float $chars;

const float $DEPTH = 8.0;
const float $RADIUS = 6.0;
const float $OUTSET = 3.0;

// A point on pixel px of the canvas, depth in front of the camera: it stays on
// that pixel however the camera sways, so it keeps to the panel.
vec3 $place(vec2 px, float depth) {
  vec2 ndc = vec2(px.x / $screen.x * 2.0 - 1.0, 1.0 - px.y / $screen.y * 2.0);
  vec3 right = vec3(uView[0][0], uView[1][0], uView[2][0]);
  vec3 up = vec3(uView[0][1], uView[1][1], uView[2][1]);
  vec3 forward = -vec3(uView[0][2], uView[1][2], uView[2][2]);
  float x = (ndc.x + uProjection[2][0]) / uProjection[0][0];
  float y = (ndc.y + uProjection[2][1]) / uProjection[1][1];
  return uRayOrigin + (forward + right * x + up * y) * depth;
}

// Character k of the code, counted over every line: its line's packed value
// and the character's place in it.
vec2 $char(float k) {
  float left = k;
  for (int i = 0; i < $MAX_LINES; i++) {
    if (float(i) >= $count) break;
    float packed = $lines[i / 4][i % 4];
    float len = mod(floor(packed / 64.0), 128.0);
    if (left < len || float(i) >= $count - 1.0) return vec2(packed, min(left, len));
    left -= len;
  }
  return vec2(0.0);
}

Particle $main(uint id, float sel, Frame f) {
  uint s = seedOf(id, 0xC0DEB10Cu);
  float a = rnd(s);
  float b = rnd(s);
  float c = rnd(s);
  float d = rnd(s);
  float e = rnd(s);
  Particle P = blank();

  // Gathered as the chapter comes in, each particle on its own beat; then
  // the code fades in over them, and they dim.
  float gather = smoothstep(d * 0.2, d * 0.2 + 0.5, f.approach);
  float settle = $reveal;

  vec2 size = $rect.zw;
  vec2 px;
  vec3 col;
  if (sel < 0.3) {
    // The outline, just outside the panel, which hides what's behind it; and
    // the rule under the caption, seen until the code comes in.
    float rule = step(0.85, b);
    px = rule > 0.5
      ? vec2(a * size.x, $frame.x)
      : size * 0.5 + rrectPoint(vec4(0.0, 0.0, size * 0.5 + $OUTSET), $RADIUS + $OUTSET, a);
    px += (vec2(c, e) - 0.5) * 1.5;
    col = vec3(0.85, 0.88, 0.96) * mix(0.09, 0.025 * (1.0 - rule), settle);
  } else if (sel < 0.8) {
    // The code, a character at a time.
    vec2 ch = $char(floor(a * $chars));
    float indent = mod(ch.x, 64.0);
    float row = floor(ch.x / 8192.0);
    float x = (indent + ch.y + b) * $text.w;
    px = vec2($text.x + min(x, $frame.y), $text.y + (row + 0.3 + c * 0.4) * $text.z);
    col = vec3(0.6, 0.86, 0.94) * 0.08 * (1.0 - settle);
  } else {
    // Dust that never settles, drifting around the panel.
    px = vec2(a, b) * size;
    gather = 0.0;
    col = vec3(0.7, 0.75, 0.95) * 0.006;
  }

  // Loose: scattered around its place, nearer or deeper, in a slow current.
  vec2 spread = gauss(c, e) * size * 0.15;
  vec2 drift = curl(vec3(px * 0.004, f.time * 0.05 + d)).xy * 40.0;
  vec2 loose = px + spread + drift;
  float depth = $DEPTH * (1.0 + (e - 0.5) * 0.8);

  P.pos = $place($rect.xy + mix(loose, px, gather), mix(depth, $DEPTH, gather));
  P.col = col * mix(0.35, 1.0, gather);
  P.size = 0.8;
  return P;
}
`;

interface Layout {
	/** The chapter's code panel, which gets `data-gather` and the reveal. */
	panel: HTMLElement | null;
	/** The part of the section's hold the code fades in over (`revealOf`). */
	span: number;
	/** The panel's page offset, so its top on screen follows the scroll. */
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * The GPU half of `codeBlock`. It measures the chapter's code panel and its
 * section when the page resizes, never per frame. Each frame, it moves the
 * panel by the page's own scroll, which the page renders with in the same
 * frame, so the outline can't trail it, and writes the gather and the reveal
 * on the panel. The scene's eased scroll drives those two.
 */
export function createShader(key: string): FormationShader {
	const layout: Layout = {
		panel: null,
		span: 0,
		left: 0,
		top: 0,
		width: 0,
		height: 0,
	};
	let dirty = true;

	let gather = "";
	let reveal = "";

	const measure = ({ gl, get }: Uniforms) => {
		// The chapter's `[data-stage]` element, which carries its id.
		const stage = document.getElementById(key);
		const panel = stage?.querySelector<HTMLElement>("[data-code-panel]");
		const canvas =
			document.querySelector<HTMLCanvasElement>(".ux-stage__canvas");
		if (!stage || !panel || !canvas) return;

		// The section's hold, as the scene measures it (createExperience).
		const viewport = window.innerHeight;
		const maxScroll = Math.max(
			1,
			document.documentElement.scrollHeight - viewport,
		);
		const rect = stage.getBoundingClientRect();
		const hold = sectionSpan(
			rect.top + window.scrollY,
			rect.height,
			viewport,
			maxScroll,
		);
		const length = hold.end - hold.start;
		layout.span = length > 0 ? Math.min(1, (FADE * viewport) / length) : 0;

		// A new panel (the page re-rendered) gets the gather written again.
		if (panel !== layout.panel) gather = reveal = "";
		const box = panel.getBoundingClientRect();
		Object.assign(layout, {
			panel,
			left: box.left,
			top: box.top + window.scrollY,
			width: box.width,
			height: box.height,
		});
		gl.uniform2f(get("screen"), canvas.clientWidth, canvas.clientHeight);

		// The code's lines, on a grid of the first block's line height.
		const blocks = Array.from(panel.querySelectorAll("pre"));
		const first = blocks[0];
		if (!first) return;
		const style = getComputedStyle(first);
		const pitch = Number.parseFloat(style.lineHeight);
		const padding = Number.parseFloat(style.paddingTop);
		const inset = Number.parseFloat(style.paddingLeft);
		const top = first.getBoundingClientRect().top - box.top + padding;
		const packed: number[] = [];
		let chars = 0;
		for (const pre of blocks) {
			const rect = pre.getBoundingClientRect();
			const firstRow = Math.round((rect.top - box.top + padding - top) / pitch);
			const rows = Math.floor((rect.height - 2 * padding) / pitch);
			const lines = (pre.textContent ?? "").replace(/\n$/, "").split("\n");
			lines.slice(0, rows).forEach((line, i) => {
				const row = firstRow + i;
				const indent = Math.min(63, line.length - line.trimStart().length);
				const length = Math.min(127, line.trim().length);
				if (length === 0 || row > 63 || packed.length >= MAX_LINES) return;
				packed.push(indent + 64 * length + 8192 * row);
				chars += length;
			});
		}
		const caption = panel.querySelector("figcaption");
		const rule = caption ? caption.getBoundingClientRect().bottom - box.top : 0;
		const left = first.getBoundingClientRect().left - box.left + inset;
		gl.uniform4f(
			get("text"),
			left,
			top,
			pitch,
			Number.parseFloat(style.fontSize) * 0.6,
		);
		gl.uniform2f(get("frame"), rule, first.clientWidth - 2 * inset);
		gl.uniform4fv(
			get("lines"),
			Float32Array.from({ length: MAX_LINES }, (_, i) => packed[i] ?? 0),
		);
		gl.uniform1f(get("count"), packed.length);
		gl.uniform1f(get("chars"), chars);
	};

	return {
		glsl,
		setup() {
			// The scene has no teardown for a formation: once the chapter has
			// gone (another page), the next resize stops listening.
			const stage = document.getElementById(key);
			const invalidate = () => {
				dirty = true;
				if (stage?.isConnected) return;
				observer.disconnect();
				window.removeEventListener("resize", invalidate);
			};
			const observer = new ResizeObserver(invalidate);
			observer.observe(document.body);
			window.addEventListener("resize", invalidate);
		},
		update(uniforms, frame) {
			if (dirty) {
				dirty = false;
				measure(uniforms);
			}
			uniforms.gl.uniform4f(
				uniforms.get("rect"),
				layout.left,
				layout.top - window.scrollY,
				layout.width,
				layout.height,
			);

			// SiteSplit fades the code in by REVEAL_PROPERTY, once the scene draws
			// with motion on; `data-gather` lets a check read the gather.
			const amount = revealOf(frame.approach, frame.local, layout.span);
			uniforms.gl.uniform1f(uniforms.get("reveal"), amount);
			const { panel } = layout;
			if (!panel) return;
			const nextGather = gatherOf(frame.approach).toFixed(3);
			const nextReveal = amount.toFixed(3);
			if (nextGather !== gather) {
				gather = nextGather;
				panel.dataset.gather = gather;
			}
			if (nextReveal !== reveal) {
				reveal = nextReveal;
				panel.style.setProperty(REVEAL_PROPERTY, reveal);
			}
		},
	};
}
