declare module "virtual:pg-react-vendor" {
	export interface ReactVendor {
		/** IIFE that publishes React on `globalThis.PGReactVendor`. */
		iife: string;
		/** Named exports of `react`. */
		reactKeys: Array<string>;
		/** Named exports of `react-dom/client`. */
		reactDomClientKeys: Array<string>;
		/** Named exports of `react/jsx-runtime`. */
		jsxRuntimeKeys: Array<string>;
	}
	const vendor: ReactVendor;
	export default vendor;
}

declare module "virtual:pg-runtime-src" {
	const source: string;
	export default source;
}
