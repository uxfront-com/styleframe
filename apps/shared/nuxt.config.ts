import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-22",
	telemetry: false,
	devtools: { enabled: true },
	modules: [
		resolve("./modules/config"),
		resolve("./modules/routing"),
		"@nuxt/ui",
		"@nuxt/image",
		"@nuxt/scripts",
		"@nuxt/test-utils",
		"@nuxtjs/robots",
		"nuxt-og-image",
		"nuxt-llms",
	],
	icon: {
		serverBundle: "local",
		fetchTimeout: 10_000,
	},
});
