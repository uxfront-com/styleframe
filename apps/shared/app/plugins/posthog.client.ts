import type { ConfigDefaults } from "posthog-js";
import posthog from "posthog-js";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
	if (import.meta.dev) {
		return;
	}

	// Consumers opt out via `app.config` (`analytics.enabled: false`).
	if (!useAppConfig().analytics?.enabled) {
		return;
	}

	const runtimeConfig = useRuntimeConfig();

	const posthogClient = posthog.init(runtimeConfig.public.posthog.key, {
		api_host: runtimeConfig.public.posthog.host,
		defaults: runtimeConfig.public.posthog.defaults as ConfigDefaults,
		person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
		loaded: (posthog) => {
			if (import.meta.env.MODE === "development") {
				posthog.debug();
			}
		},
	});

	return {
		provide: {
			posthog: () => posthogClient,
		},
	};
});
