export interface BuildSrcdocInput {
	/** Generated styleframe CSS plus any CSS emitted by user imports. */
	css: string;
	/** The compiled preview module. */
	bundleJs: string;
	/** IIFE that publishes React on `globalThis.PGReactVendor`. */
	reactIife: string;
}

export interface BuildSrcdocResult {
	srcdoc: string;
	revoke: () => void;
}

function makeBlobUrl(code: string): string {
	return URL.createObjectURL(new Blob([code], { type: "application/javascript" }));
}

/**
 * Assemble the preview document: the React vendor runs first as a classic
 * script (publishing `globalThis.PGReactVendor`), then the bundled preview
 * module reads React off that global. No importmap is needed — everything
 * except React is already inlined into the bundle.
 */
export function buildSrcdoc(input: BuildSrcdocInput): BuildSrcdocResult {
	const { css, bundleJs, reactIife } = input;

	const reactUrl = makeBlobUrl(reactIife);
	const bundleUrl = makeBlobUrl(bundleJs);

	const srcdoc = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; height: 100%; }
  #root { min-height: 100%; }
</style>
<style id="pg-user-styles">${css}</style>
</head>
<body>
<div id="root"></div>
<script src=${JSON.stringify(reactUrl)}></script>
<script type="module" src=${JSON.stringify(bundleUrl)}></script>
</body>
</html>`;

	const revoke = () => {
		URL.revokeObjectURL(reactUrl);
		URL.revokeObjectURL(bundleUrl);
	};

	return { srcdoc, revoke };
}
