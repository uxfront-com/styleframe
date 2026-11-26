<script setup lang="ts">
import { useSupabaseClient } from "#imports";
import type { AuthFormField } from "@nuxt/ui";

const supabase = useSupabaseClient();
const toast = useToast();

definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: "Reset Password",
	description: "Set a new password for your styleframe account",
});

const fields: Array<AuthFormField> = [
	{
		name: "password",
		label: "New Password",
		type: "password" as const,
		placeholder: "Enter your new password",
		required: true,
	},
	{
		name: "confirmPassword",
		label: "Confirm Password",
		type: "password" as const,
		placeholder: "Confirm your new password",
		required: true,
	},
];

const updateUserPassword = async (payload: {
	data: { password: string; confirmPassword: string };
}) => {
	const { password, confirmPassword } = payload.data;

	if (password !== confirmPassword) {
		toast.add({
			title: "Error",
			description: "Passwords do not match",
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	const { error } = await supabase.auth.updateUser({
		password,
	});

	if (error) {
		toast.add({
			title: "Error",
			description: error.message,
			icon: "i-lucide-alert-circle",
			color: "error",
		});
	} else {
		toast.add({
			title: "Password updated",
			description: "Your password has been successfully updated",
			icon: "i-lucide-check-circle",
			color: "success",
		});
		await navigateTo("/");
	}
};
</script>

<template>
	<UPageCard class="max-w-sm w-full h-full mx-auto my-auto">
		<UAuthForm
			title="Set new password"
			:fields="fields"
			:providers="[]"
			submit-button="Update password"
			@submit="updateUserPassword"
		>
			<template #footer>
				Remember your password?
				<UButton variant="link" class="p-0" to="/login"> Sign in </UButton>.
			</template>
		</UAuthForm>
	</UPageCard>
</template>
