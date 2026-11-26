<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

useSeoMeta({
	title: "Debug Config",
	description: "Debug runtime configuration",
});

definePageMeta({
	layout: "auth",
});

const configData = computed(() => ({
	public: runtimeConfig.public,
	window: {
		origin: typeof window !== "undefined" ? window.location.origin : "N/A",
		href: typeof window !== "undefined" ? window.location.href : "N/A",
		hostname: typeof window !== "undefined" ? window.location.hostname : "N/A",
	},
	env: {
		mode: import.meta.env.MODE,
		dev: import.meta.dev,
		prod: import.meta.prod,
	},
	computed: {
		oauthRedirectUrl: `${runtimeConfig.public.baseUrl}/confirm`,
		effectiveRedirectUrl: runtimeConfig.public.baseUrl
			? `${runtimeConfig.public.baseUrl}/confirm`
			: typeof window !== "undefined"
				? `${window.location.origin}/confirm`
				: "UNDEFINED",
	},
}));

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(
			JSON.stringify(configData.value, null, 2),
		);
		alert("Config copied to clipboard!");
	} catch (error) {
		console.error("Failed to copy:", error);
	}
};
</script>

<template>
	<UPageCard class="max-w-4xl w-full mx-auto my-8">
		<div class="space-y-6">
			<div class="flex justify-between items-center">
				<h1 class="text-2xl font-bold">Runtime Config Debug</h1>
				<UButton icon="i-lucide-copy" variant="outline" @click="copyToClipboard">
					Copy Config
				</UButton>
			</div>

			<div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 overflow-auto">
				<pre class="text-xs"><code>{{ JSON.stringify(configData, null, 2) }}</code></pre>
			</div>

			<div class="space-y-4">
				<div class="border-t pt-4">
					<h2 class="text-lg font-semibold mb-2">Key Values</h2>
					<dl class="space-y-2">
						<div class="flex gap-4">
							<dt class="font-medium min-w-[200px]">Base URL:</dt>
							<dd class="text-gray-600 dark:text-gray-400 break-all">
								{{ runtimeConfig.public.baseUrl || "(empty string)" }}
							</dd>
						</div>
						<div class="flex gap-4">
							<dt class="font-medium min-w-[200px]">Window Origin:</dt>
							<dd class="text-gray-600 dark:text-gray-400 break-all">
								{{ configData.window.origin }}
							</dd>
						</div>
						<div class="flex gap-4">
							<dt class="font-medium min-w-[200px]">OAuth Redirect URL:</dt>
							<dd class="text-gray-600 dark:text-gray-400 break-all">
								{{ configData.computed.effectiveRedirectUrl }}
							</dd>
						</div>
						<div class="flex gap-4">
							<dt class="font-medium min-w-[200px]">Supabase URL:</dt>
							<dd class="text-gray-600 dark:text-gray-400 break-all">
								{{ runtimeConfig.public.supabase.url || "(not set)" }}
							</dd>
						</div>
					</dl>
				</div>

				<div class="border-t pt-4">
					<h2 class="text-lg font-semibold mb-2">Environment Check</h2>
					<ul class="space-y-1">
						<li v-if="!runtimeConfig.public.baseUrl" class="text-red-600 dark:text-red-400">
							⚠️ baseUrl is empty - OAuth will likely fail in production
						</li>
						<li
							v-else-if="
								runtimeConfig.public.baseUrl.includes('localhost')
							"
							class="text-yellow-600 dark:text-yellow-400"
						>
							⚠️ baseUrl points to localhost
						</li>
						<li v-else class="text-green-600 dark:text-green-400">✓ baseUrl is configured</li>
					</ul>
				</div>

				<div class="border-t pt-4">
					<h2 class="text-lg font-semibold mb-2">Recommended Fix</h2>
					<div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
						<p class="mb-2">Set this environment variable in your deployment platform:</p>
						<code class="block bg-white dark:bg-gray-800 p-3 rounded text-sm">
							NUXT_PUBLIC_BASE_URL={{ configData.window.origin }}
						</code>
					</div>
				</div>
			</div>

			<div class="text-center pt-4">
				<UButton to="/login" variant="soft"> Back to Login </UButton>
			</div>
		</div>
	</UPageCard>
</template>
