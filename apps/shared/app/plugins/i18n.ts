export default defineNuxtPlugin(() => {
	// Consumers opt out via `app.config` (`i18nRedirect.enabled: false`).
	if (!useAppConfig().i18nRedirect?.enabled) {
		return;
	}

	const nuxtApp = useNuxtApp();

	const i18nConfig = nuxtApp.$config.public.i18n as { defaultLocale?: string } | undefined;
	if (!i18nConfig) {
		return;
	}

	addRouteMiddleware((to) => {
		if (to.path === "/") {
			const cookieLocale = useCookie("i18n_redirected").value || i18nConfig.defaultLocale || "en";

			return navigateTo(`/${cookieLocale}`);
		}
	});
});
