import {
	BASE_PARTICLES,
	glslArray,
	glslFloat,
	glslVec,
	packShapes,
} from "@uxfront/scene";
import type { FormationShader, Shape } from "@uxfront/scene";
import { deviceAt, deviceProgress } from "./device";

/** "Aa", the text on the screen, in units of its cap height, baseline at 0. */
const GLYPHS = packShapes([
	{ kind: "seg", a: [0, 0], b: [0.36, 1], bright: 1 },
	{ kind: "seg", a: [0.36, 1], b: [0.72, 0], bright: 1 },
	{ kind: "seg", a: [0.14, 0.38], b: [0.58, 0.38], bright: 1 },
	{ kind: "circle", c: [1.1, 0.3], r: 0.3, bright: 1 },
	{ kind: "seg", a: [1.4, 0], b: [1.4, 0.62], bright: 1 },
] satisfies Shape[]);

/**
 * The paragraph under it, as one bar per word, its length in ems. It wraps to
 * the screen's width, so it reflows as the device changes.
 */
const WORDS =
	"Fluid type grows and shrinks with the screen, from a minimum size on phones to a maximum on desktops, and scales smoothly in between, with no breakpoints at all."
		.split(" ")
		.map((word) => word.length * 0.5);
const TOTAL = WORDS.reduce((sum, length) => sum + length, 0);

/** Particle shares, in `sel` order. */
const BODY = 0.2;
const SCREEN = 0.28;
const STAND = 0.34;
const TITLE = 0.44;
const TEXT = 0.82;
const GLOW = 0.92;

// Line brightness, independent of a line's length and of its particle count.
const LINE_GAIN = 70 / BASE_PARTICLES;

export const shader: FormationShader = {
	glsl: /* glsl */ `
uniform vec2 $half;
uniform float $corner;
uniform float $type;
uniform float $stand;

const float $BEZEL = 0.08;
const float $NECK = 0.42;
const float $FOOT = 0.62;
const vec3 $TEAL = vec3(0.31, 0.71, 0.78);
const vec3 $WHITE = vec3(0.86, 0.93, 1.0);

const int $GLYPHS = ${GLYPHS.cdf.length};
const vec4 $GLYPH_A[$GLYPHS] = ${glslArray("vec4", GLYPHS.a.map(glslVec))};
const vec4 $GLYPH_B[$GLYPHS] = ${glslArray("vec4", GLYPHS.b.map(glslVec))};
const float $GLYPH_CDF[$GLYPHS] = ${glslArray("float", GLYPHS.cdf.map(glslFloat))};

const int $WORDS = ${WORDS.length};
const float $WORD[$WORDS] = ${glslArray("float", WORDS.map(glslFloat))};
const float $TOTAL = ${glslFloat(TOTAL)};

int $findGlyph(float x) {
  for (int k = 0; k < $GLYPHS - 1; k++) {
    if (x < $GLYPH_CDF[k]) return k;
  }
  return $GLYPHS - 1;
}

// Where the text's x-th em falls once the paragraph wraps to lines width ems
// long: its line, and its offset along it.
vec2 $wrap(float x, float width) {
  float run = 0.0;
  float at = 0.0;
  float line = 0.0;
  for (int k = 0; k < $WORDS; k++) {
    float w = $WORD[k];
    if (at > 0.0 && at + w > width) {
      line += 1.0;
      at = 0.0;
    }
    if (x < run + w || k == $WORDS - 1) return vec2(at + x - run, line);
    run += w;
    at += w + 0.35;
  }
  return vec2(0.0);
}

Particle $main(uint id, float sel, Frame f) {
  uint s = seedOf(id, 0xDE71CEu);
  float a = rnd(s);
  float b = rnd(s);
  float c = rnd(s);
  Particle P = blank();
  P.size = 0.8;

  // The desktop stands on its foot, so it rises to keep the whole centred.
  vec2 centre = vec2(0.0, $stand * $NECK * 0.6);
  vec2 screen = $half - $BEZEL;
  float pad = $type * 0.5;
  vec2 corner = centre + vec2(-screen.x + pad, screen.y - pad);
  float body = $type * 0.3;

  if (sel < ${glslFloat(BODY)}) {
    // The body's outline.
    float len = 4.0 * ($half.x + $half.y);
    vec2 p = rrectPoint(vec4(centre, $half), $corner, a);
    P.pos = vec3(p + (vec2(b, c) - 0.5) * 0.01, 0.0);
    P.col = $WHITE * 0.75 * len * ${glslFloat(LINE_GAIN / BODY)};
  } else if (sel < ${glslFloat(SCREEN)}) {
    // The screen's edge, inside the bezel.
    float len = 4.0 * (screen.x + screen.y);
    vec2 p = rrectPoint(vec4(centre, screen), max($corner - $BEZEL, 0.02), a);
    P.pos = vec3(p, 0.0);
    P.col = $TEAL * 0.5 * len * ${glslFloat(LINE_GAIN / (SCREEN - BODY))};
  } else if (sel < ${glslFloat(STAND)}) {
    // The desktop's stand, a neck and a foot. Until the device is a desktop,
    // it folds into the bottom of the body, dark.
    vec2 base = centre - vec2(0.0, $half.y);
    vec2 p = a < 0.4
      ? base - vec2(0.0, $NECK * $stand * a / 0.4)
      : base - vec2(($FOOT * ((a - 0.4) / 0.6 * 2.0 - 1.0)) * $stand, $NECK * $stand);
    P.pos = vec3(p + (vec2(b, c) - 0.5) * 0.01, 0.0);
    P.col = $WHITE * 0.75 * ($NECK + 2.0 * $FOOT) * $stand * ${glslFloat(LINE_GAIN / (STAND - SCREEN))};
  } else if (sel < ${glslFloat(TITLE)}) {
    // "Aa", at the fluid type size.
    int k = $findGlyph(a);
    vec2 q = shapePoint($GLYPH_A[k], $GLYPH_B[k], b, c);
    vec2 jitter = (vec2(c, rnd(s)) - 0.5) * 0.05;
    P.pos = vec3(corner + (vec2(q.x, q.y - 1.0) + jitter) * $type, 0.0);
    P.col = $WHITE * 3.0 * ${glslFloat(GLYPHS.totalWeight)} * $type * ${glslFloat(LINE_GAIN / (TITLE - STAND))};
  } else if (sel < ${glslFloat(TEXT)}) {
    // The paragraph, wrapped to the screen. Lines that don't fit stay dark.
    vec2 w = $wrap(a * $TOTAL, (screen.x - pad) * 2.0 / body);
    float y = corner.y - $type * 1.6 - w.y * body * 1.9;
    P.pos = vec3(corner.x + w.x * body, y + (b - 0.5) * body * 0.55, 0.0);
    float shown = step(centre.y - screen.y + pad * 0.5, y);
    P.col = $WHITE * 0.55 * shown * ${glslFloat(TOTAL)} * body * body * ${glslFloat((LINE_GAIN * 12) / (TEXT - TITLE))};
  } else if (sel < ${glslFloat(GLOW)}) {
    // The screen's glow.
    P.pos = vec3(centre + (vec2(a, b) * 2.0 - 1.0) * screen, -0.02);
    P.col = $TEAL * 0.012;
  } else {
    // Dust caught in the light.
    vec3 p = vec3(mix(-5.0, 5.0, a), mix(-2.6, 2.6, b), mix(-4.0, 2.0, c));
    p.x = mod(p.x + f.time * 0.04 + 5.0, 10.0) - 5.0;
    P.pos = p;
    P.col = vec3(0.7, 0.75, 0.9) * 0.04 * step(0.5, rnd(s));
    P.size = 0.9;
  }
  return P;
}
`,
	update: ({ gl, get }, { local, motion }) => {
		const shape = deviceAt(deviceProgress(local, motion));
		gl.uniform2f(get("half"), shape.half[0], shape.half[1]);
		gl.uniform1f(get("corner"), shape.corner);
		gl.uniform1f(get("type"), shape.type);
		gl.uniform1f(get("stand"), shape.stand);
	},
};
