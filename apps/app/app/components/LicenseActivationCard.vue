<script setup lang="ts">
import { useSupabaseClient } from "#imports";
import { activateLicense } from "~/api/license";
import type { AuthFormField } from "@nuxt/ui";

const supabase = useSupabaseClient();
const toast = useToast();
const loading = ref(false);
const success = ref(false);

const fields: Array<AuthFormField> = [
	{
		name: "key",
		type: "text" as const,
		label: "License Key",
		placeholder: "Enter your license key",
		required: true,
	},
	{
		name: "label",
		type: "text" as const,
		label: "GitHub Username",
		placeholder: "Enter your GitHub username",
		required: true,
	},
];

async function onSubmit(payload: { data: { label: string; key: string } }) {
	loading.value = true;

	try {
		const result = await activateLicense(supabase, {
			label: payload.data.label,
			key: payload.data.key,
		});

		if (result.success) {
			success.value = true;
			toast.add({
				title: "Success",
				description: result.message || "License activated successfully!",
				icon: "i-lucide-check-circle",
				color: "success",
			});
		} else {
			toast.add({
				title: "Error",
				description: result.error || "Failed to activate license",
				icon: "i-lucide-alert-circle",
				color: "error",
			});
		}
	} catch (error) {
		toast.add({
			title: "Error",
			description:
				error instanceof Error ? error.message : "An unexpected error occurred",
			icon: "i-lucide-alert-circle",
			color: "error",
		});
	} finally {
		loading.value = false;
	}
}

function activateAnother() {
	success.value = false;
}
</script>

<template>
	<UPageCard class="w-full">
		<div v-if="success" class="text-center py-8">
			<UIcon
				name="i-lucide-check-circle"
				class="w-16 h-16 mx-auto text-green-500 mb-4"
			/>
			<h3 class="text-xl font-semibold mb-2">License Activated!</h3>
			<p class="text-gray-600 dark:text-gray-400 mb-2">
				Your Styleframe Pro license has been successfully activated.
			</p>
			<p class="text-gray-400 dark:text-gray-600 mb-6 max-w-md mx-auto">
				Thank you so much for supporting us! Your purchase helps make styleframe
				better for everyone. We truly appreciate your trust and contribution. ❤️
			</p>
			<UButton color="primary" size="lg" @click="activateAnother">
				Activate Another License
			</UButton>
		</div>
		<UAuthForm
			v-else
			title="Activate License"
			:fields="fields"
			:loading="loading"
			@submit="onSubmit"
		>
			<template #description>
				<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
					Enter your license key and your GitHub username to activate your
					Styleframe Pro license.
				</p>
			</template>
		</UAuthForm>
	</UPageCard>
</template>
