<script setup lang="ts">
/**
 * Replaces Docus's page menu (docus/app/components/docs/DocsPageHeaderLinks.vue)
 * to leave out "Copy MCP Server URL" and "Add MCP Server": the site is static,
 * so it serves no MCP server at /mcp, where Docus's point. Keep the rest in step
 * with Docus's. It copies with the Clipboard API, since VueUse, which Docus's
 * uses, isn't the app's to import.
 */
import { useRuntimeConfig } from "#imports";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const appBaseURL = runtimeConfig.app?.baseURL || "/";

const { t } = useDocusI18n();
const copied = ref(false);
let reset: ReturnType<typeof setTimeout> | undefined;
async function copy(text: string) {
	await navigator.clipboard.writeText(text);
	copied.value = true;
	clearTimeout(reset);
	reset = setTimeout(() => (copied.value = false), 1500);
}

const markdownLink = computed(() => `${window?.location?.origin}${appBaseURL.replace(/\/?$/, "/")}raw${route.path}.md`);
const items = computed(() => [
	{
		label: t("docs.copy.link"),
		icon: "i-lucide-link",
		onSelect() {
			copy(markdownLink.value);
		},
	},
	{
		label: t("docs.copy.view"),
		icon: "i-simple-icons:markdown",
		target: "_blank",
		to: markdownLink.value,
	},
	{
		label: t("docs.copy.gpt"),
		icon: "i-simple-icons:openai",
		target: "_blank",
		to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${markdownLink.value} so I can ask questions about it.`)}`,
	},
	{
		label: t("docs.copy.claude"),
		icon: "i-simple-icons:anthropic",
		target: "_blank",
		to: `https://claude.ai/new?q=${encodeURIComponent(`Read ${markdownLink.value} so I can ask questions about it.`)}`,
	},
]);

async function copyPage() {
	const page = await $fetch<string>(`/raw${route.path}.md`);
	copy(page);
}
</script>

<template>
	<UFieldGroup size="sm">
		<UButton
			:label="t('docs.copy.page')"
			:icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
			color="neutral"
			variant="soft"
			:ui="{
				leadingIcon: 'text-neutral size-3.5',
			}"
			@click="copyPage"
		/>

		<UDropdownMenu
			size="sm"
			:items="items"
			:content="{
				align: 'end',
				side: 'bottom',
				sideOffset: 8,
			}"
		>
			<UButton
				icon="i-lucide-chevron-down"
				color="neutral"
				variant="soft"
				class="border-l border-muted"
			/>
		</UDropdownMenu>
	</UFieldGroup>
</template>
