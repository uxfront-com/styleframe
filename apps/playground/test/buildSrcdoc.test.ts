import { describe, expect, it } from "vitest";

import { buildSrcdoc } from "@/pipeline/buildSrcdoc";

describe("buildSrcdoc", () => {
	it("embeds CSS, the React vendor script, and the preview module", () => {
		const { srcdoc, revoke } = buildSrcdoc({
			css: ".pg-card{color:red}",
			bundleJs: "console.log('preview');",
			reactIife: "globalThis.PGReactVendor = {};",
		});

		expect(srcdoc).toContain(".pg-card{color:red}");
		expect(srcdoc).toContain('<div id="root">');
		// The vendor runs first as a classic script; the preview as a module.
		expect(srcdoc).toMatch(/<script src=/);
		expect(srcdoc).toMatch(/<script type="module" src=/);

		revoke();
	});

	it("creates a blob URL for each script and revokes them", () => {
		const { srcdoc, revoke } = buildSrcdoc({
			css: "",
			bundleJs: "",
			reactIife: "",
		});

		const sources = [...srcdoc.matchAll(/src=("[^"]+")/g)];
		expect(sources).toHaveLength(2);
		// No importmap is needed — React is inlined via the vendor global.
		expect(srcdoc).not.toContain("importmap");
		expect(() => revoke()).not.toThrow();
	});
});
