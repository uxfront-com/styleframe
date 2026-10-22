import { defineFormation } from "@uxfront/scene";
import type { Formation, StageView } from "@uxfront/scene";

// A plain framing: the particles find their own place on the screen (see
// code.shader.ts), so the camera only matters on the way in and out.
const VIEW: StageView = {
	eye: [0, 0, 8],
	target: [0, 0, 0],
	fov: 40,
	span: [0, 0],
	shift: [0, 0],
};

/**
 * For a chapter with a code sample beside its copy: as the chapter scrolls
 * in, the particles gather into the outline of its code panel, drawing lines
 * of code inside it, and fade as the code fades in (`SiteSplit`). `key` is
 * the chapter's `id`, and the panel is its `[data-code-panel]` element.
 */
export const codeBlock = (options: { label: string; key: string }): Formation =>
	defineFormation({
		key: options.key,
		label: options.label,
		views: { desktop: VIEW, mobile: VIEW },
		shader: () =>
			import("./code.shader").then((m) => m.createShader(options.key)),
	});
