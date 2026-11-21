/**
 * The origin of Inkline's deployed preview. The URL is the only link between
 * the docs and Inkline: the docs take no package dependency on it.
 */
export const INKLINE_PREVIEW_ORIGIN =
	"https://inkline-preview.blue-water-0397.workers.dev";

export type InklineExampleTheme = "light" | "dark";

export interface InklineExampleUrlOptions {
	/** The full example id, like `src/components/button/examples/ButtonDefault`. */
	example: string;
	/** The framework target the preview renders, like `vue`. */
	target: string;
	/** Draws the example's controls below it. */
	controls?: boolean;
	/** The color mode the frame starts in. */
	theme: InklineExampleTheme;
}

/**
 * Builds the embed URL of one Inkline example. The frame always reports its
 * height, and takes later color mode changes as messages, so its URL never
 * changes after it loads.
 */
export function inklineExampleUrl({
	example,
	target,
	controls = false,
	theme,
}: InklineExampleUrlOptions): string {
	const params = new URLSearchParams({ example, target });
	if (controls) params.set("controls", "true");
	params.set("theme", theme);
	params.set("resize", "true");

	return `${INKLINE_PREVIEW_ORIGIN}/embed.html?${params.toString()}`;
}

/**
 * The message that switches a loaded frame to another color mode.
 */
export function inklineExampleThemeMessage(theme: InklineExampleTheme) {
	return { type: "unframework:embed", kind: "theme", theme } as const;
}

/**
 * Reads the content height from a frame's resize message. Returns `null` for
 * any message that doesn't come from `frameWindow` on the preview's origin, or
 * that isn't a resize message with a positive height.
 */
export function inklineExampleHeight(
	event: Pick<MessageEvent, "data" | "origin" | "source">,
	frameWindow: Window | null | undefined,
): number | null {
	if (!frameWindow || event.source !== frameWindow) return null;
	if (event.origin !== INKLINE_PREVIEW_ORIGIN) return null;

	const data = event.data as
		| { type?: unknown; kind?: unknown; height?: unknown }
		| null
		| undefined;
	if (data?.type !== "unframework:embed" || data.kind !== "resize") {
		return null;
	}

	const { height } = data;
	if (typeof height !== "number" || !Number.isFinite(height) || height <= 0) {
		return null;
	}

	return height;
}
