import type { ConfigDefaults } from "posthog-js";

// PostHog loads after the page does, on idle, so it never costs the first
// paint. Without a key, nothing loads, not even the posthog-js chunk.
export default defineNuxtPlugin(() => {
	if (import.meta.dev) {
		return;
	}

	const { key, host, defaults } = useRuntimeConfig().public.posthog;
	if (!key) {
		return;
	}

	afterLoad(async () => {
		const { default: posthog } = await import("posthog-js");
		posthog.init(key, {
			api_host: host,
			defaults: defaults as ConfigDefaults,
			person_profiles: "identified_only",
		});
	});
});
