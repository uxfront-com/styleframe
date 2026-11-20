<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import {
	INKLINE_PREVIEW_ORIGIN,
	inklineExampleHeight,
	inklineExampleThemeMessage,
	inklineExampleUrl,
	type InklineExampleTheme,
} from "~/utils/inklineExample";

interface Props {
	/** The full Inkline example id, like `src/components/button/examples/ButtonDefault`. */
	example: string;
	/** The frame's accessible name. */
	title: string;
	/** Draws the example's controls below it. */
	controls?: boolean;
	/** The framework target the preview renders. */
	target?: string;
	/** A fixed height, in place of the height the frame reports. */
	height?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
	controls: false,
	target: "vue",
	height: undefined,
});

const colorMode = useColorMode();
const containerRef = useTemplateRef<HTMLElement>("container");
const iframeRef = useTemplateRef<HTMLIFrameElement>("iframe");

const theme = computed<InklineExampleTheme>(() =>
	colorMode.value === "dark" ? "dark" : "light",
);

// The URL is built once, when the frame mounts. A later mode change goes to
// the frame as a message, since a new URL would reload it and lose the
// reader's control values.
const src = ref<string | null>(null);
const { stop } = useIntersectionObserver(
	containerRef,
	([entry]) => {
		if (entry?.isIntersecting) {
			src.value = inklineExampleUrl({
				example: props.example,
				target: props.target,
				controls: props.controls,
				theme: theme.value,
			});
			stop();
		}
	},
	{ rootMargin: "200px" },
);

// Close to the heights the Button examples report, so the page barely moves
// when a frame reports its own.
const defaultHeight = computed(() => (props.controls ? 680 : 260));
const messageHeight = ref<number | null>(null);
const frameHeight = computed(
	() => props.height ?? messageHeight.value ?? defaultHeight.value,
);

function sendTheme() {
	iframeRef.value?.contentWindow?.postMessage(
		inklineExampleThemeMessage(theme.value),
		INKLINE_PREVIEW_ORIGIN,
	);
}

function onMessage(event: MessageEvent) {
	const height = inklineExampleHeight(event, iframeRef.value?.contentWindow);
	if (height !== null) messageHeight.value = height;
}

onMounted(() => {
	window.addEventListener("message", onMessage);
});

onUnmounted(() => {
	window.removeEventListener("message", onMessage);
});

watch(theme, sendTheme);
</script>

<template>
	<div
		ref="container"
		class="inkline-example"
		:style="{ height: `${frameHeight}px` }"
	>
		<iframe
			v-if="src"
			ref="iframe"
			:src="src"
			:title="title"
			width="100%"
			height="100%"
			@load="sendTheme"
		/>
	</div>
</template>

<style>
.inkline-example {
	border: 1px solid var(--color-gray-200);
	border-radius: 8px;
	overflow: hidden;
	min-height: 100px;
	transition: height 0.15s ease-out;
}

.inkline-example iframe {
	display: block;
	border: 0;
}

.dark-theme .inkline-example,
.dark .inkline-example {
	border-color: var(--color-gray-700);
}

@media (prefers-reduced-motion: reduce) {
	.inkline-example {
		transition: none;
	}
}
</style>
