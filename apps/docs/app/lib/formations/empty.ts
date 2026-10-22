import { defineFormation } from "@uxfront/scene";
import type { Formation, FormationShader, StageView } from "@uxfront/scene";

// The corridor's framing, so the camera holds still into the finale.
const VIEW: StageView = {
	eye: [0, 0, 7],
	target: [0, 0, -12],
	fov: 56,
	span: [0, 0],
	shift: [0, 0],
};

// Every particle has no colour, so the scene skips it. It also waits far down
// the view, past the far plane: a morph lights particles up on their way, and
// between two empty sections that light stays out of sight.
const EMPTY: FormationShader = {
	glsl: /* glsl */ `
Particle $main(uint id, float sel, Frame f) {
  Particle P = blank();
  P.pos = vec3(0.0, 0.0, -1000.0);
  return P;
}
`,
};

/**
 * Draws nothing, for a section that holds no formation. `UxSite` needs one
 * formation per section, so give each repeat its own `key`.
 */
export const empty = (options: { label: string; key?: string }): Formation =>
	defineFormation({
		key: options.key ?? "empty",
		label: options.label,
		views: { desktop: VIEW, mobile: { ...VIEW, fov: 64 } },
		shader: async () => EMPTY,
	});
