<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";

interface Props {
	story: string;
	height?: number | string;
	panel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	height: undefined,
	panel: false,
});

const colorMode = useColorMode();
const containerRef = useTemplateRef<HTMLElement>("container");
const iframeRef = useTemplateRef<HTMLIFrameElement>("iframe");

const visible = ref(false);
const { stop } = useIntersectionObserver(
	containerRef,
	([entry]) => {
		if (entry?.isIntersecting) {
			visible.value = true;
			stop();
		}
	},
	{ rootMargin: "200px" },
);

const baseUrl = import.meta.dev
	? "http://localhost:6006"
	: "https://storybook.styleframe.dev";

const defaultHeight = computed(() => (props.panel ? 600 : 320));
const messageHeight = ref<number | null>(null);
const iframeHeight = computed(
	() => props.height ?? messageHeight.value ?? defaultHeight.value,
);

const src = computed(() =>
	props.panel
		? `${baseUrl}/?path=/story/${props.story}&shortcuts=false&singleStory=true`
		: `${baseUrl}/?path=/story/${props.story}&full=1&shortcuts=false&singleStory=true`,
);

function sendThemeToIframe() {
	iframeRef.value?.contentWindow?.postMessage(
		{ type: "styleframe:theme", theme: colorMode.value },
		"*",
	);
}

function onIframeLoad() {
	sendThemeToIframe();
}

function onMessage(event: MessageEvent) {
	if (
		event.data?.type === "styleframe:height" &&
		typeof event.data.height === "number"
	) {
		if (event.source === iframeRef.value?.contentWindow) {
			messageHeight.value = event.data.height;
		}
	}
}

onMounted(() => {
	window.addEventListener("message", onMessage);
});

onUnmounted(() => {
	window.removeEventListener("message", onMessage);
});

watch(() => colorMode.value, sendThemeToIframe);
</script>

<template>
	<div ref="container" class="story-preview" :style="{ height: `${iframeHeight}px` }">
		<iframe
			v-if="visible"
			ref="iframe"
			:src="src"
			width="100%"
			height="100%"
			frameborder="0"
			@load="onIframeLoad"
		/>
	</div>
</template>

<style>
.story-preview {
	border: 1px solid var(--color-gray-200);
	border-radius: 8px;
	overflow: hidden;
	resize: vertical;
	min-height: 100px;
	transition: height 0.15s ease-out;
}

.story-preview iframe {
	display: block;
}

.dark-theme .story-preview,
.dark .story-preview {
	border-color: var(--color-gray-700);
}
</style>
