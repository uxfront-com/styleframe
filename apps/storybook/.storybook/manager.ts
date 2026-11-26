import { UPDATE_DARK_MODE_EVENT_NAME } from "@vueless/storybook-dark-mode";
import { addons } from "storybook/manager-api";

import { light, dark } from "./theme";

const STORAGE_KEY = "sb-addon-themes-3";
const channel = addons.getChannel();

window.addEventListener("message", (event: MessageEvent) => {
	if (event.data?.type === "styleframe:theme") {
		const mode = event.data.theme === "dark" ? "dark" : "light";

		// Update the addon's localStorage store so renderTheme() won't revert
		const storedItem = window.localStorage.getItem(STORAGE_KEY);
		if (storedItem) {
			try {
				const stored = JSON.parse(storedItem);
				stored.current = mode;
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
			} catch {
				// Corrupted localStorage entry — skip update
			}
		}

		// Update manager UI theme directly
		addons.setConfig({ theme: mode === "dark" ? dark : light });

		// Also emit to the addon (for DarkMode component state + preview sync)
		channel.emit(UPDATE_DARK_MODE_EVENT_NAME, mode);

		// Trigger the theme change window message for the preview iframe
		const iframe = document.getElementById("storybook-preview-iframe") as HTMLIFrameElement | null;

		iframe?.contentWindow?.postMessage(
			{
				type: "styleframe:theme",
				theme: mode,
			},
			window.location.origin,
		);
	}
});

// Auto-size: relay preview content height to docs parent when embedded
if (window !== window.parent) {
	const PADDING = 64;
	const params = new URLSearchParams(window.location.search);
	const isFullMode = params.has("full");

	window.addEventListener("message", (event: MessageEvent) => {
		if (event.data?.type === "styleframe:preview-height") {
			let totalHeight: number;

			if (isFullMode) {
				// Full mode: just content + padding (no visible chrome)
				totalHeight = event.data.height + PADDING;
			} else {
				// Panel mode: content + chrome (toolbar + panel)
				const previewIframe = document.getElementById(
					"storybook-preview-iframe",
				) as HTMLIFrameElement | null;
				if (!previewIframe) {
					return;
				}

				const chromeHeight = window.innerHeight - previewIframe.offsetHeight;
				totalHeight = chromeHeight + event.data.height + PADDING;
			}

			window.parent.postMessage({ type: "styleframe:height", height: totalHeight }, "*");
		}
	});
}
