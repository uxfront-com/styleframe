<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

useSeoMeta({
	title: "Logging Out",
	description: "Signing you out of styleframe",
});

definePageMeta({
	layout: "auth",
});

const error = ref<string | null>(null);

// Sign out immediately on mount
onMounted(async () => {
	try {
		const { error: signOutError } = await supabase.auth.signOut();

		if (signOutError) {
			error.value = signOutError.message;
		} else {
			// Redirect to login after successful sign out
			await router.push("/login");
		}
	} catch (error_) {
		error.value =
			error_ instanceof Error ? error_.message : "An error occurred during sign out";
	}
});
</script>

<template>
	<UPageCard class="max-w-sm w-full h-full mx-auto my-auto">
		<div v-if="error" class="text-center">
			<div class="text-red-500 mb-4">
				<Icon name="i-lucide-alert-circle" class="w-12 h-12 mx-auto mb-2" />
				<p class="font-semibold">Sign Out Error</p>
			</div>
			<p class="text-sm text-gray-500 mb-4">{{ error }}</p>
			<UButton to="/login" variant="soft"> Back to Login </UButton>
		</div>
		<div v-else class="text-center">
			<div class="mb-4">
				<Icon name="i-lucide-loader-2" class="w-12 h-12 mx-auto animate-spin text-primary" />
			</div>
			<p class="font-semibold mb-2">Signing you out...</p>
			<p class="text-sm text-gray-500">Please wait while we log you out.</p>
		</div>
	</UPageCard>
</template>
