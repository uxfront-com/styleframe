import { lerp, sectionSpan } from "@uxfront/scene";
import type {
	FormationProgress,
	FormationShader,
	SectionSpan,
	Uniforms,
} from "@uxfront/scene";

/** Lines of code the particles draw, at most: four to a `vec4`. */
const MAX_LINES = 48;

/**
 * The scroll offset the scene is at, from the stage formation `k` sees and
 * the sections' spans (the inverse of `stageAt` around section `k`). The
 * scene follows the scroll with some easing, so this is where its particles
 * are, which can trail the page by a few frames.
 */
export function scrollAt(
	spans: readonly SectionSpan[],
	k: number,
	frame: Pick<FormationProgress, "stage" | "local" | "approach" | "presence">,
): number {
	const span = spans[k];
	if (!span) return 0;
	// Morphing in from the section before.
	if (frame.stage < k - 1e-4)
		return lerp(spans[k - 1]?.end ?? span.start, span.start, frame.approach);
	// Morphing out into the section after.
	if (frame.stage > k + 1e-4)
		return lerp(span.end, spans[k + 1]?.start ?? span.end, 1 - frame.presence);
	return lerp(span.start, span.end, frame.local);
}

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
  // the code fades in over them (SiteSplit), and they dim.
  float gather = smoothstep(d * 0.2, d * 0.2 + 0.5, f.approach);
  float settle = smoothstep(0.7, 1.0, f.approach);

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
	/** The sections' spans, as the scene measures them. */
	spans: SectionSpan[];
	/** This formation's section. */
	index: number;
	/** The panel: its page offset, so its top on screen follows the scroll. */
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * The GPU half of `codeBlock`. It measures the chapter's code panel when the
 * page resizes, never per frame: each frame only moves the panel by the
 * scroll offset the scene is at.
 */
export function createShader(key: string): FormationShader {
	const layout: Layout = {
		spans: [],
		index: -1,
		left: 0,
		top: 0,
		width: 0,
		height: 0,
	};
	let dirty = true;

	const measure = ({ gl, get }: Uniforms) => {
		const sections = Array.from(
			document.querySelectorAll<HTMLElement>("[data-stage]"),
		);
		const panel = document
			.getElementById(key)
			?.querySelector<HTMLElement>("[data-code-panel]");
		const canvas =
			document.querySelector<HTMLCanvasElement>(".ux-stage__canvas");
		if (!panel || !canvas) return;

		// As the scene measures its sections (createExperience).
		const viewport = window.innerHeight;
		const maxScroll = Math.max(
			1,
			document.documentElement.scrollHeight - viewport,
		);
		layout.spans = sections.map((el) => {
			const rect = el.getBoundingClientRect();
			return sectionSpan(
				rect.top + window.scrollY,
				rect.height,
				viewport,
				maxScroll,
			);
		});
		layout.index = sections.findIndex((el) => el.id === key);

		const box = panel.getBoundingClientRect();
		Object.assign(layout, {
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
			const section = document.getElementById(key);
			const invalidate = () => {
				dirty = true;
				if (section?.isConnected) return;
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
			const top = layout.top - scrollAt(layout.spans, layout.index, frame);
			uniforms.gl.uniform4f(
				uniforms.get("rect"),
				layout.left,
				top,
				layout.width,
				layout.height,
			);
		},
	};
}
