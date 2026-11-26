import { computed, ref } from "vue";

export type ThemeMode = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "sf-playground-theme";
const THEME_ATTRIBUTE = "data-theme";
const THEME_MODES: ReadonlyArray<ThemeMode> = ["auto", "light", "dark"];

function isThemeMode(value: unknown): value is ThemeMode {
	return typeof value === "string" && (THEME_MODES as ReadonlyArray<string>).includes(value);
}

export function readStoredMode(): ThemeMode {
	if (typeof localStorage === "undefined") {
		return "auto";
	}
	try {
		const raw = localStorage.getItem(THEME_STORAGE_KEY);
		return isThemeMode(raw) ? raw : "auto";
	} catch {
		return "auto";
	}
}

function writeStoredMode(value: ThemeMode): void {
	if (typeof localStorage === "undefined") {
		return;
	}
	try {
		if (value === "auto") {
			localStorage.removeItem(THEME_STORAGE_KEY);
		} else {
			localStorage.setItem(THEME_STORAGE_KEY, value);
		}
	} catch {
		// ignore quota / privacy-mode failures
	}
}

export function systemPrefersDark(): boolean {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
		return false;
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
	if (mode === "auto") {
		return systemPrefersDark() ? "dark" : "light";
	}
	return mode;
}

function applyToDom(mode: ThemeMode, resolved: ResolvedTheme): void {
	if (typeof document === "undefined") {
		return;
	}
	const html = document.documentElement;
	if (mode === "auto") {
		html.removeAttribute(THEME_ATTRIBUTE);
	} else {
		html.setAttribute(THEME_ATTRIBUTE, mode);
	}
	// Mirror the resolved theme onto #app so any `[data-theme='dark'] &`
	// selector targeting the app root matches, regardless of mode.
	const app = document.getElementById("app");
	if (app) {
		app.setAttribute(THEME_ATTRIBUTE, resolved);
	}
}

const mode = ref<ThemeMode>(readStoredMode());
const systemIsDark = ref<boolean>(systemPrefersDark());
const resolved = computed<ResolvedTheme>(() => {
	if (mode.value === "auto") {
		return systemIsDark.value ? "dark" : "light";
	}
	return mode.value;
});

let mediaQuery: MediaQueryList | null = null;
let mediaListener: ((event: MediaQueryListEvent) => void) | null = null;
let initialized = false;

function ensureInitialized(): void {
	if (initialized) {
		return;
	}
	initialized = true;
	mode.value = readStoredMode();
	systemIsDark.value = systemPrefersDark();
	applyToDom(mode.value, resolved.value);
	if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
		mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaListener = (event) => {
			systemIsDark.value = event.matches;
			if (mode.value === "auto") {
				applyToDom(mode.value, resolved.value);
			}
		};
		mediaQuery.addEventListener("change", mediaListener);
	}
}

function setMode(next: ThemeMode): void {
	mode.value = next;
	writeStoredMode(next);
	applyToDom(next, resolved.value);
}

function toggle(): void {
	const idx = THEME_MODES.indexOf(mode.value);
	const next = THEME_MODES[(idx + 1) % THEME_MODES.length];
	setMode(next);
}

export function useTheme() {
	ensureInitialized();
	return { mode, resolved, setMode, toggle };
}

/**
 * Test-only reset hook. Detaches listeners and restores defaults so each
 * test can exercise initialization from a clean slate.
 */
export function __resetThemeForTests(): void {
	if (mediaQuery && mediaListener) {
		mediaQuery.removeEventListener("change", mediaListener);
	}
	mediaQuery = null;
	mediaListener = null;
	initialized = false;
	mode.value = "auto";
	systemIsDark.value = false;
}
