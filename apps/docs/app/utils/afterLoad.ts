/**
 * Runs `callback` once the page's `load` event has fired and the browser is
 * idle, so the work it starts never competes with the first paint.
 */
export function afterLoad(callback: () => void): void {
	const whenIdle = () => {
		if (typeof requestIdleCallback === "function") {
			requestIdleCallback(() => callback());
		} else {
			setTimeout(callback, 1);
		}
	};

	if (document.readyState === "complete") {
		whenIdle();
	} else {
		window.addEventListener("load", whenIdle, { once: true });
	}
}
