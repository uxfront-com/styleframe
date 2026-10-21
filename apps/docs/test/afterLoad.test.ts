import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { afterLoad } from "../app/utils/afterLoad";

describe("afterLoad", () => {
	let loadListeners: Array<() => void>;
	let idleCallbacks: Array<() => void>;

	function stubPage(readyState: DocumentReadyState) {
		vi.stubGlobal("document", { readyState });
		vi.stubGlobal("window", {
			addEventListener: (type: string, listener: () => void) => {
				if (type === "load") loadListeners.push(listener);
			},
		});
		vi.stubGlobal("requestIdleCallback", (callback: () => void) => {
			idleCallbacks.push(callback);
			return idleCallbacks.length;
		});
	}

	beforeEach(() => {
		loadListeners = [];
		idleCallbacks = [];
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("waits for the load event, then for the browser to be idle", () => {
		stubPage("interactive");
		const callback = vi.fn();

		afterLoad(callback);
		expect(loadListeners).toHaveLength(1);
		expect(idleCallbacks).toHaveLength(0);

		loadListeners[0]!();
		expect(callback).not.toHaveBeenCalled();
		expect(idleCallbacks).toHaveLength(1);

		idleCallbacks[0]!();
		expect(callback).toHaveBeenCalledOnce();
	});

	it("waits only for idle when the page has already loaded", () => {
		stubPage("complete");
		const callback = vi.fn();

		afterLoad(callback);
		expect(loadListeners).toHaveLength(0);
		expect(idleCallbacks).toHaveLength(1);

		idleCallbacks[0]!();
		expect(callback).toHaveBeenCalledOnce();
	});

	it("falls back to a timeout where requestIdleCallback is missing", () => {
		vi.useFakeTimers();
		stubPage("complete");
		vi.stubGlobal("requestIdleCallback", undefined);
		const callback = vi.fn();

		afterLoad(callback);
		expect(callback).not.toHaveBeenCalled();

		vi.runAllTimers();
		expect(callback).toHaveBeenCalledOnce();
		vi.useRealTimers();
	});
});
