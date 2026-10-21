/**
 * `docsTheme`, which @uxfront/layer-docs reads from app config. Nuxt types app
 * config from the values the app and its layers set, and the layer types only
 * what an app may set, so the header's `docsTheme.wordmark`, which this app
 * leaves unset, wouldn't typecheck without it.
 */
declare module "@nuxt/schema" {
	interface CustomAppConfig {
		docsTheme?: {
			frameworks: { value: string; label: string; icon: string }[];
			wordmark?: { bold: string; regular: string };
			byline?: boolean;
		};
	}
}

export {};
