<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

// The waitlist form main's subscribe modal had: it signs an email up to a
// Loops mailing list group, at most once a minute per browser.
const { group, label } = defineProps<{
	/** The Loops user group, like `ai`. */
	group: string;
	label: string;
}>();

const ENDPOINT =
	"https://app.loops.so/api/newsletter-form/cmcc289ja7g5x0j0iqdjc14v3";
const RATE_LIMIT = 60000;

const previousTimestamp = useLocalStorage("subscribe-form-timestamp", 0);
const email = ref("");
const message = ref<{ text: string; error: boolean }>();

async function onSubmit() {
	const timestamp = Date.now();
	if (
		previousTimestamp.value &&
		Number(previousTimestamp.value) + RATE_LIMIT > timestamp
	) {
		message.value = {
			text: "Too many signups, please try again in a little while.",
			error: true,
		};
		return;
	}
	previousTimestamp.value = timestamp;

	try {
		const response = await fetch(ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `userGroup=${group}&mailingLists=&email=${encodeURIComponent(email.value)}`,
		});
		const data = await response.json();
		if (!data.success) {
			throw new Error("Failed to submit form");
		}
		message.value = { text: "Thanks! We'll be in touch!", error: false };
		email.value = "";
	} catch (error) {
		message.value = {
			text: "There was an error submitting the form.",
			error: true,
		};
		console.error("Error submitting form:", error);
	}
}
</script>

<template>
	<form class="site-waitlist" :aria-label="label" @submit.prevent="onSubmit">
		<p class="site-waitlist__title">{{ label }}</p>
		<div class="site-waitlist__row">
			<label class="site-waitlist__field">
				<span class="ux-mono">Email</span>
				<input
					v-model="email"
					type="email"
					name="email"
					autocomplete="email"
					placeholder="you@example.com"
					required
				/>
			</label>
			<button type="submit">Join Waitlist</button>
		</div>
		<p
			class="site-waitlist__message"
			:class="{ 'is-error': message?.error }"
			role="status"
		>
			{{ message?.text }}
		</p>
	</form>
</template>

<style scoped>
.site-waitlist {
	margin-top: 1.5rem;
	padding: 1rem;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
	background: rgb(5 5 7 / 0.85);
	backdrop-filter: blur(10px);
	text-shadow: none;
}

.site-waitlist__title {
	margin: 0 0 0.75rem;
	font-weight: 500;
	color: var(--ux-fg);
}

.site-waitlist__row {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	gap: 0.75rem;
}

.site-waitlist__field {
	display: grid;
	flex: 1 1 14rem;
	gap: 0.35rem;
}

.site-waitlist__field .ux-mono {
	font-size: 0.75rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--ux-fg-2);
}

.site-waitlist input,
.site-waitlist button {
	min-height: 2.75rem;
	border-radius: 999px;
	font: inherit;
	font-size: 0.875rem;
}

.site-waitlist input {
	padding: 0 1rem;
	border: 1px solid var(--ux-line-strong);
	background: transparent;
	color: var(--ux-fg);
}

.site-waitlist input::placeholder {
	color: var(--ux-fg-3);
}

.site-waitlist button {
	padding: 0 1.25rem;
	border: 1px solid var(--ux-fg);
	background: var(--ux-fg);
	color: var(--ux-bg);
	cursor: pointer;
	transition: opacity 0.3s var(--ux-ease-out);
}

.site-waitlist button:hover {
	opacity: 0.85;
}

.site-waitlist :is(input, button):focus-visible {
	outline: 2px solid var(--ux-fg);
	outline-offset: 2px;
}

.site-waitlist__message {
	min-height: 1.25rem;
	margin: 0.75rem 0 0;
	font-size: 0.875rem;
	color: var(--ux-fg-2);
}

.site-waitlist__message.is-error {
	color: var(--ux-fg);
}
</style>
