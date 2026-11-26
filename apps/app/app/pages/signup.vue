<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from "#imports";
import type { AuthFormField } from "@nuxt/ui";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const runtimeConfig = useRuntimeConfig();
const toast = useToast();

definePageMeta({
	layout: "auth",
});

useSeoMeta({
	title: "Sign Up",
	description: "Create an account to access all styleframe features",
});

const signupComplete = ref(false);
const userEmail = ref("");

watchEffect(() => {
	if (user.value && !signupComplete.value) {
		return navigateTo("/");
	}
});

const fields: Array<AuthFormField> = [
	{
		name: "email",
		type: "text" as const,
		label: "Email",
		placeholder: "Enter your email",
		required: true,
	},
	{
		name: "password",
		label: "Password",
		type: "password" as const,
		placeholder: "Enter your password",
	},
	{
		name: "confirmPassword",
		label: "Confirm Password",
		type: "password" as const,
		placeholder: "Confirm your password",
	},
];

const providers = [
	{
		label: "Sign up with GitHub",
		icon: "i-simple-icons-github",
		onClick: async () => {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "github",
				options: {
					redirectTo: `${window.location.origin}/confirm`,
				},
			});
			if (error) {displayError(error);}
		},
	},
];

const signIn = async (email: string, password: string) => {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) {displayError(error);}
};

const signUp = async (email: string, password: string) => {
	const { error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		displayError(error);
	} else {
		// Show email confirmation screen
		userEmail.value = email;
		signupComplete.value = true;
	}
};

async function onSubmit(payload: {
	data: { email: string; password: string; confirmPassword: string };
}) {
	const email = payload.data.email;
	const password = payload.data.password;
	const confirmPassword = payload.data.confirmPassword;

	// Validate that passwords match
	if (password !== confirmPassword) {
		toast.add({
			title: "Error",
			description: "Passwords do not match",
			icon: "i-lucide-alert-circle",
			color: "error",
		});
		return;
	}

	await signUp(email, password);
}

const displayError = (error: Error) => {
	toast.add({
		title: "Error",
		description: error.message,
		icon: "i-lucide-alert-circle",
		color: "error",
	});
};
</script>

<template>
	<UPageCard class="max-w-sm w-full h-full mx-auto my-auto">
		<!-- Email Confirmation Screen -->
		<div v-if="signupComplete" class="text-center">
			<div class="mb-4">
				<Icon
					name="i-lucide-mail-check"
					class="w-16 h-16 mx-auto text-primary mb-4"
				/>
				<h2 class="text-2xl font-bold mb-2">Check your email</h2>
			</div>
			<p class="mb-4">
				We've sent a confirmation email to
				<strong>{{ userEmail }}</strong>
			</p>
			<p class="text-md mb-6">
				Please click the link in the email to verify your account and complete
				your registration.
			</p>
			<div class="space-y-3">
				<p class="text-md text-gray-500">
					Didn't receive the email? Check your spam folder or
					<UButton
						variant="link"
						class="p-0 text-md"
						@click="signupComplete = false"
					>
						try again </UButton
					>.
				</p>
			</div>
		</div>

		<!-- Signup Form -->
		<UAuthForm
			v-else
			title="Sign up to styleframe"
			:fields="fields"
			:providers="providers"
			@submit="onSubmit"
		>
			<template #footer>
				Already have an account?
				<UButton variant="link" class="p-0" to="/login"> Sign in </UButton>.
			</template>
		</UAuthForm>
	</UPageCard>
</template>
