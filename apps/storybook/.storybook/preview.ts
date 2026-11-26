import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/vue3-vite";

import "virtual:styleframe.css";
import "./docs.css";
import { DARK_MODE_EVENT_NAME, useDarkMode } from "@vueless/storybook-dark-mode";
import React from "react";
import { addons } from "storybook/preview-api";

import { light, dark } from "./theme";

const channel = addons.getChannel();

channel.on(DARK_MODE_EVENT_NAME, (isDark: boolean) => {
	if (isDark) {
		document.body.dataset.theme = "dark";
		document.body.classList.remove("default-theme");
		document.body.classList.add("dark-theme");
	} else {
		delete document.body.dataset.theme;
		document.body.classList.remove("dark-theme");
		document.body.classList.add("default-theme");
	}
});

window.addEventListener("message", (event: MessageEvent) => {
	if (event.data?.type === "styleframe:theme") {
		const mode = event.data.theme === "dark" ? "dark" : "light";

		channel.emit(DARK_MODE_EVENT_NAME, mode === "dark");
	}
});

const ThemedDocsContainer: typeof DocsContainer = (props) => {
	const isDark = useDarkMode();
	return React.createElement(DocsContainer, {
		...props,
		theme: isDark ? dark : light,
	});
};

const preview: Preview = {
	parameters: {
		layout: "centered",
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},

		actions: {},

		darkMode: {
			stylePreview: true,
			current: "light",
			darkClass: ["dark-theme"],
			lightClass: ["default-theme"],
			dark,
			light,
		},

		docs: {
			source: {
				type: "code",
			},
			container: ThemedDocsContainer,
		},
	},
};

// Auto-size: report story content height to the manager frame
if (window !== window.parent) {
	let lastHeight = 0;

	const sendHeight = () => {
		const root = document.getElementById("storybook-root");
		if (!root) {
			return;
		}
		const height = root.offsetHeight;
		if (height !== lastHeight) {
			lastHeight = height;
			window.parent.postMessage({ type: "styleframe:preview-height", height }, "*");
		}
	};

	const waitForRoot = () => {
		const root = document.getElementById("storybook-root");
		if (root) {
			const ro = new ResizeObserver(sendHeight);
			ro.observe(root);
			const mo = new MutationObserver(sendHeight);
			mo.observe(root, { childList: true, subtree: true });
			sendHeight();
		} else {
			requestAnimationFrame(waitForRoot);
		}
	};

	if (document.readyState === "complete") {
		waitForRoot();
	} else {
		window.addEventListener("load", waitForRoot);
	}
}

export default preview;
