<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from "#imports";
import type { AuthFormField } from "@nuxt/ui";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const runtimeConfig = useRuntimeConfig();
const toast = useToast();

useSeoMeta({
	title: "Log In",
	description: "Log in to access all styleframe features",
});

definePageMeta({
	layout: "auth",
});

watchEffect(() => {
	if (user.value) {
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
];

const providers = [
	{
		label: "Log in with GitHub",
		icon: "i-simple-icons-github",
		onClick: async () => {
			// Determine the correct redirect URL
			const redirectUrl = runtimeConfig.public.baseUrl
				? `${runtimeConfig.public.baseUrl}/confirm`
				: `${window.location.origin}/confirm`;

			const { error } = await supabase.auth.signInWithOAuth({
				provider: "github",
				options: {
					redirectTo: redirectUrl,
					skipBrowserRedirect: false,
				},
			});

			if (error) {
				console.error("OAuth Error:", error);
				displayError(error);
			}
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

async function onSubmit(payload: {
	data: { email: string; password: string };
}) {
	const email = payload.data.email;
	const password = payload.data.password;

	await signIn(email, password);
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
		<UAuthForm
			title="Log in to styleframe"
			:fields="fields"
			:providers="providers"
			@submit="onSubmit"
		>
			<template #footer>
				<p class="mb-4">
					<UButton variant="link" class="p-0" to="/forgot-password">
						Forgot your password?
					</UButton>
				</p>
				<p>
					Don't have an account?
					<UButton variant="link" class="p-0" to="/signup"> Sign up </UButton>.
				</p>
			</template>
		</UAuthForm>
	</UPageCard>
</template>
