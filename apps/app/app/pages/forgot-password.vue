<script setup lang="ts">
import { useRuntimeConfig, useSupabaseClient } from "#imports";
import type { AuthFormField } from "@nuxt/ui";

const runtimeConfig = useRuntimeConfig();
const supabase = useSupabaseClient();
const toast = useToast();

definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: "Forgot Password",
	description: "Reset your styleframe account password",
});

const resetEmailSent = ref(false);
const userEmail = ref("");

const fields: Array<AuthFormField> = [
	{
		name: "email",
		type: "text" as const,
		label: "Email",
		placeholder: "Enter your email",
		required: true,
	},
];

const requestResetPassword = async (payload: { data: { email: string } }) => {
	const email = payload.data.email;

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${runtimeConfig.public.baseUrl}/reset-password`,
	});

	if (error) {
		toast.add({
			title: "Error",
			description: error.message,
			icon: "i-lucide-alert-circle",
			color: "error",
		});
	} else {
		// Show email confirmation screen
		userEmail.value = email;
		resetEmailSent.value = true;
	}
};
</script>

<template>
	<UPageCard class="max-w-sm w-full h-full mx-auto my-auto">
		<!-- Email Sent Confirmation Screen -->
		<div v-if="resetEmailSent" class="text-center">
			<div class="mb-4">
				<Icon
					name="i-lucide-mail-check"
					class="w-16 h-16 mx-auto text-primary mb-4"
				/>
				<h2 class="text-2xl font-bold mb-2">Check your email</h2>
			</div>
			<p class="mb-4">
				We've sent a password reset link to
				<strong>{{ userEmail }}</strong>
			</p>
			<p class="text-md mb-6">
				Please click the link in the email to reset your password.
			</p>
			<div class="space-y-3">
				<p class="text-md text-gray-500">
					Didn't receive the email? Check your spam folder or
					<UButton
						variant="link"
						class="p-0 text-md"
						@click="resetEmailSent = false"
					>
						try again </UButton
					>.
				</p>
				<p class="text-md">
					<UButton variant="link" class="p-0" to="/login">
						Back to login
					</UButton>
				</p>
			</div>
		</div>

		<!-- Reset Password Form -->
		<UAuthForm
			v-else
			title="Reset your password"
			:fields="fields"
			:providers="[]"
			submit-button="Send reset link"
			@submit="requestResetPassword"
		>
			<template #footer>
				Remember your password?
				<UButton variant="link" class="p-0" to="/login"> Sign in </UButton>.
			</template>
		</UAuthForm>
	</UPageCard>
</template>
