import { describe, expect, it } from "vitest";
import {
	INKLINE_PREVIEW_ORIGIN,
	inklineExampleHeight,
	inklineExampleThemeMessage,
	inklineExampleUrl,
} from "../app/utils/inklineExample";

const example = "src/components/button/examples/ButtonDefault";

function query(url: string) {
	const parsed = new URL(url);
	return { parsed, params: parsed.searchParams };
}

describe("inklineExampleUrl", () => {
	it("points at the preview's embed page", () => {
		const { parsed } = query(
			inklineExampleUrl({ example, target: "vue", theme: "light" }),
		);

		expect(parsed.origin).toBe(INKLINE_PREVIEW_ORIGIN);
		expect(parsed.pathname).toBe("/embed.html");
	});

	it("passes the example, the target, the theme and resize", () => {
		const { params } = query(
			inklineExampleUrl({ example, target: "vue", theme: "light" }),
		);

		expect(params.get("example")).toBe(example);
		expect(params.get("target")).toBe("vue");
		expect(params.get("theme")).toBe("light");
		expect(params.get("resize")).toBe("true");
		expect(params.has("controls")).toBe(false);
	});

	it("starts the frame in dark mode", () => {
		const { params } = query(
			inklineExampleUrl({ example, target: "vue", theme: "dark" }),
		);

		expect(params.get("theme")).toBe("dark");
	});

	it("adds controls only when asked", () => {
		const withControls = query(
			inklineExampleUrl({
				example,
				target: "vue",
				theme: "light",
				controls: true,
			}),
		);
		const without = query(
			inklineExampleUrl({
				example,
				target: "vue",
				theme: "light",
				controls: false,
			}),
		);

		expect(withControls.params.get("controls")).toBe("true");
		expect(without.params.has("controls")).toBe(false);
	});

	it("encodes the example id as a query value", () => {
		const url = inklineExampleUrl({
			example: "a/b c&d=e",
			target: "vue",
			theme: "light",
		});

		expect(url).toContain("example=a%2Fb+c%26d%3De");
		expect(query(url).params.get("example")).toBe("a/b c&d=e");
	});
});

describe("inklineExampleThemeMessage", () => {
	it("is the embed's theme message", () => {
		expect(inklineExampleThemeMessage("dark")).toEqual({
			type: "unframework:embed",
			kind: "theme",
			theme: "dark",
		});
	});
});

describe("inklineExampleHeight", () => {
	const frame = {} as Window;
	const resize = (height: unknown) => ({
		type: "unframework:embed",
		kind: "resize",
		height,
	});
	const event = (
		overrides: Partial<Pick<MessageEvent, "data" | "origin" | "source">> = {},
	) => ({
		data: resize(480),
		origin: INKLINE_PREVIEW_ORIGIN,
		source: frame,
		...overrides,
	});

	it("returns the height of the frame's resize message", () => {
		expect(inklineExampleHeight(event(), frame)).toBe(480);
	});

	it("ignores a message from another origin", () => {
		expect(
			inklineExampleHeight(event({ origin: "https://example.com" }), frame),
		).toBeNull();
	});

	it("ignores a message from another window", () => {
		expect(
			inklineExampleHeight(event({ source: {} as Window }), frame),
		).toBeNull();
	});

	it("ignores every message before the frame exists", () => {
		expect(inklineExampleHeight(event({ source: null }), null)).toBeNull();
		expect(inklineExampleHeight(event(), undefined)).toBeNull();
	});

	it("ignores another message type or kind", () => {
		expect(
			inklineExampleHeight(
				event({ data: { ...resize(480), type: "styleframe:height" } }),
				frame,
			),
		).toBeNull();
		expect(
			inklineExampleHeight(
				event({ data: { ...resize(480), kind: "theme" } }),
				frame,
			),
		).toBeNull();
		expect(inklineExampleHeight(event({ data: null }), frame)).toBeNull();
	});

	it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY, "480", undefined])(
		"ignores the height %s",
		(height) => {
			expect(
				inklineExampleHeight(event({ data: resize(height) }), frame),
			).toBeNull();
		},
	);
});
