import { clamp, defineFormation, lerp, smoothstep } from "@uxfront/scene";
import type { Formation, StageView, Vec2 } from "@uxfront/scene";

/** The device's outline at one point of the scroll, in world units. */
export interface DeviceShape {
	/** Half size of its body. */
	half: Vec2;
	/** Corner radius of its body. */
	corner: number;
	/** Cap height of the text on its screen: the fluid type size. */
	type: number;
	/** How much of the desktop's stand shows, 0 → 1. */
	stand: number;
}

const PHONE = { half: [0.62, 1.25] as Vec2, corner: 0.16 };
const TABLET = { half: [1.2, 1.55] as Vec2, corner: 0.12 };
const DESKTOP = { half: [2.6, 1.5] as Vec2, corner: 0.05 };
const KEYS = [PHONE, TABLET, DESKTOP];

/**
 * The text's cap height on the phone and on the desktop. In between, it
 * follows the screen's width, like a fluid type scale.
 */
const TYPE: Vec2 = [0.3, 0.72];

/** Where the device stays without motion: the tablet, between the two ends. */
const STILL = 0.5;

/**
 * The device at scroll progress `progress`: a phone at 0, a tablet at 0.5 and
 * a desktop at 1. It holds each one a moment before it turns into the next.
 */
export function deviceAt(progress: number): DeviceShape {
	const k = clamp(progress, 0, 1) * 2;
	const i = Math.min(Math.floor(k), 1);
	const t = smoothstep(0.2, 0.8, k - i);
	const from = KEYS[i]!;
	const to = KEYS[i + 1]!;
	const half: Vec2 = [
		lerp(from.half[0], to.half[0], t),
		lerp(from.half[1], to.half[1], t),
	];
	const fluid = (half[0] - PHONE.half[0]) / (DESKTOP.half[0] - PHONE.half[0]);
	return {
		half,
		corner: lerp(from.corner, to.corner, t),
		type: lerp(TYPE[0], TYPE[1], fluid),
		stand: i === 1 ? t : 0,
	};
}

/** The device progress a frame shows: the scroll's, or the still one without motion. */
export const deviceProgress = (local: number, motion: boolean) =>
	motion ? local : STILL;

const VIEW: StageView = {
	eye: [0, 0, 7],
	target: [0, 0, 0],
	fov: 40,
	span: [2.8, 1.9],
	shift: [0, 0],
};

/**
 * A device drawn in particles, behind the fluid typography section: a phone
 * that grows into a tablet, then a desktop, as the section is read, with text
 * on its screen that grows with it. Without motion it shows the tablet, still.
 */
export const device = (options: { label: string; key?: string }): Formation =>
	defineFormation({
		key: options.key ?? "device",
		label: options.label,
		views: {
			desktop: VIEW,
			mobile: { ...VIEW, fov: 48, shift: [0, 0.3] },
		},
		look: { bloom: 0.8, reflect: 0 },
		shader: () => import("./device.shader").then((m) => m.shader),
	});
