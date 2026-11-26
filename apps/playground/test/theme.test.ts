// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { __resetThemeForTests, resolveTheme, THEME_STORAGE_KEY, useTheme } from "@/state/theme";

function stubMatchMedia(matches: boolean) {
	const listeners = new Set<(event: MediaQueryListEvent) => void>();
	const mql: MediaQueryList = {
		matches,
		media: "(prefers-color-scheme: dark)",
		onchange: null,
		addEventListener: (_type, handler) => {
			listeners.add(handler as (event: MediaQueryListEvent) => void);
		},
		removeEventListener: (_type, handler) => {
			listeners.delete(handler as (event: MediaQueryListEvent) => void);
		},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => true,
	} as unknown as MediaQueryList;
	window.matchMedia = vi.fn().mockReturnValue(mql);
	return {
		mql,
		emit(next: boolean) {
			(mql as unknown as { matches: boolean }).matches = next;
			for (const l of listeners) {
				l({ matches: next } as MediaQueryListEvent);
			}
		},
	};
}

beforeEach(() => {
	localStorage.clear();
	document.documentElement.removeAttribute("data-theme");
	document.body.innerHTML = '<div id="app"></div>';
});

afterEach(() => {
	__resetThemeForTests();
	vi.restoreAllMocks();
});

describe("resolveTheme", () => {
	it("returns the explicit mode when not auto", () => {
		expect(resolveTheme("light")).toBe("light");
		expect(resolveTheme("dark")).toBe("dark");
	});

	it("falls back to system preference when mode is auto", () => {
		stubMatchMedia(true);
		expect(resolveTheme("auto")).toBe("dark");
		stubMatchMedia(false);
		expect(resolveTheme("auto")).toBe("light");
	});
});

describe("useTheme", () => {
	it("defaults to auto and applies no data-theme attribute on html", () => {
		stubMatchMedia(false);
		const { mode } = useTheme();
		expect(mode.value).toBe("auto");
		expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
	});

	it("hydrates mode from localStorage", () => {
		localStorage.setItem(THEME_STORAGE_KEY, "dark");
		__resetThemeForTests();
		stubMatchMedia(false);
		const { mode, resolved } = useTheme();
		expect(mode.value).toBe("dark");
		expect(resolved.value).toBe("dark");
	});

	it("setMode writes to localStorage and updates <html> and #app", () => {
		stubMatchMedia(false);
		const { setMode, resolved } = useTheme();
		setMode("dark");
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
		expect(document.getElementById("app")?.getAttribute("data-theme")).toBe("dark");
		expect(resolved.value).toBe("dark");
	});

	it("setMode('auto') clears the stored value and html attribute", () => {
		localStorage.setItem(THEME_STORAGE_KEY, "dark");
		__resetThemeForTests();
		stubMatchMedia(false);
		const { setMode } = useTheme();
		setMode("auto");
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
		expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
	});

	it("toggle cycles auto -> light -> dark -> auto", () => {
		stubMatchMedia(false);
		const { mode, toggle } = useTheme();
		expect(mode.value).toBe("auto");
		toggle();
		expect(mode.value).toBe("light");
		toggle();
		expect(mode.value).toBe("dark");
		toggle();
		expect(mode.value).toBe("auto");
	});

	it("updates #app data-theme when system preference changes in auto mode", () => {
		const media = stubMatchMedia(false);
		const { resolved } = useTheme();
		expect(resolved.value).toBe("light");
		media.emit(true);
		expect(document.getElementById("app")?.getAttribute("data-theme")).toBe("dark");
	});
});
