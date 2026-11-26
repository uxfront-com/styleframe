// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	extends: ["../shared"],
	compatibilityDate: "2025-07-22",
	modules: ["@nuxtjs/supabase"],
	css: ["./app/assets/css/main.css"],
	llms: {
		domain: "https://app.styleframe.dev",
		title: "Styleframe",
	},
	supabase: {
		redirect: true,
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			exclude: ["/login", "/signup", "/confirm", "/debug", "/forgot-password", "/reset-password"],
		},
		clientOptions: {
			auth: {
				flowType: "implicit",
				detectSessionInUrl: true,
				persistSession: true,
			},
		},
	},
	routeRules: {
		"/privacy": {
			redirect: "https://www.styleframe.dev/privacy",
		},
		"/terms": {
			redirect: "https://www.styleframe.dev/terms",
		},
		"/license": {
			redirect: "https://www.styleframe.dev/license",
		},
	},
	runtimeConfig: {
		public: {
			baseUrl: "",
			posthog: {
				host: "",
				key: "",
				defaults: "",
			},
			supabase: {
				url: "",
				key: "",
			},
		},
	},
});
