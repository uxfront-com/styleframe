<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useTheme } from "@/state/theme";

const props = defineProps<{ srcdoc: string }>();
const emit = defineEmits<{
	"runtime-error": [message: string];
}>();

const iframe = ref<HTMLIFrameElement | null>(null);
const { resolved } = useTheme();

/**
 * Mirror the shell's resolved theme (light/dark — `system` is already resolved)
 * onto the preview document's root so its `[data-theme="dark"]` styles apply.
 * Runs on every iframe load (each rebuild swaps the document) and whenever the
 * theme changes.
 */
function applyTheme() {
	const root = iframe.value?.contentDocument?.documentElement;
	if (root) {root.setAttribute("data-theme", resolved.value);}
}

watch(resolved, applyTheme);

function onMessage(event: MessageEvent) {
	const data = event.data as
		| { type?: string; detail?: { message?: string; stack?: string } }
		| undefined;
	if (!data || data.type !== "pg:error") {return;}
	const detail = data.detail ?? {};
	const parts = [detail.message, detail.stack].filter(Boolean);
	emit("runtime-error", parts.join("\n") || "Unknown runtime error");
}

onMounted(() => {
	window.addEventListener("message", onMessage);
});

onBeforeUnmount(() => {
	window.removeEventListener("message", onMessage);
});

watch(
	() => props.srcdoc,
	(next) => {
		if (iframe.value) {iframe.value.srcdoc = next;}
	},
	{ immediate: false },
);
</script>

<template>
	<iframe
		ref="iframe"
		:srcdoc="srcdoc"
		sandbox="allow-scripts allow-same-origin"
		title="Styleframe preview"
		:style="{ width: '100%', height: '100%', border: 'none', background: 'transparent' }"
		@load="applyTheme"
	/>
</template>
