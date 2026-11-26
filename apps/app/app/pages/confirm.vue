<script setup lang="ts">
const user = useSupabaseUser();
const route = useRoute();

const error = ref<string | null>(null);

useSeoMeta({
	title: "Signin Confirmation",
	description: "Confirm your authentication to access all styleframe features",
});

definePageMeta({
	layout: "auth",
});

// Handle OAuth callback on mount
onMounted(async () => {
	const errorCode = route.query.error as string | undefined;
	const errorDescription = route.query.error_description as string | undefined;

	// Handle OAuth errors
	if (errorCode) {
		error.value = errorDescription || "Authentication failed";
		return;
	}
});

watch(
	user,
	() => {
		if (user.value) {
			// Redirect to the saved path, or fallback to home
			return navigateTo("/");
		}
	},
	{ immediate: true },
);
</script>

<template>
	<UPageCard class="max-w-sm w-full h-full mx-auto my-auto">
		<div v-if="error" class="text-center">
			<div class="text-red-500 mb-4">
				<Icon name="i-lucide-alert-circle" class="w-12 h-12 mx-auto mb-2" />
				<p class="font-semibold">Authentication Error</p>
			</div>
			<p class="text-sm text-gray-500 mb-4">{{ error }}</p>
			<UButton to="/login" variant="soft"> Back to Login </UButton>
		</div>
		<div v-else class="text-center">
			<div class="mb-4">
				<Icon name="i-lucide-loader-2" class="w-12 h-12 mx-auto animate-spin text-primary" />
			</div>
			<p class="font-semibold mb-2">Completing authentication...</p>
			<p class="text-sm text-gray-500">Please wait while we sign you in.</p>
		</div>
	</UPageCard>
</template>
