<script setup lang="ts">
import { computed } from "vue";
import {
	pgBrowserAction,
	pgBrowserActions,
	pgBrowserChrome,
	pgBrowserDot,
	pgBrowserDots,
	pgBrowserUrl,
	pgBrowserUrlText,
	pgBrowserViewport,
	pgBrowserViewportFrame,
	pgHmrDot,
	pgHmrIndicator,
} from "virtual:styleframe";
import Icon from "./Icon.vue";

type ViewportSize = "mobile" | "tablet" | "desktop";

const props = withDefaults(
	defineProps<{
		url?: string;
		hmrReady?: boolean;
		srcdoc?: string;
		viewport?: ViewportSize;
	}>(),
	{
		url: "localhost:5173",
		hmrReady: true,
		srcdoc: "",
		viewport: "desktop",
	},
);

const emit = defineEmits<{
	refresh: [];
	"update:viewport": [value: ViewportSize];
}>();

const viewportIcon = computed(() => {
	if (props.viewport === "mobile") {return "smartphone";}
	if (props.viewport === "tablet") {return "tablet";}
	return "monitor";
});

const viewportLabel = computed(() => {
	if (props.viewport === "mobile") {return "Viewport: Mobile";}
	if (props.viewport === "tablet") {return "Viewport: Tablet";}
	return "Viewport: Desktop";
});

const nextViewport = computed<ViewportSize>(() => {
	if (props.viewport === "mobile") {return "tablet";}
	if (props.viewport === "tablet") {return "desktop";}
	return "mobile";
});

function onToggleViewport() {
	emit("update:viewport", nextViewport.value);
}

function openInNewTab() {
	if (!props.srcdoc) {return;}
	const opened = window.open("", "_blank");
	if (!opened) {return;}
	opened.document.open();
	opened.document.write(props.srcdoc);
	opened.document.close();
}
</script>

<template>
	<div style="display: flex; flex-direction: column; height: 100%; min-height: 0">
		<div :class="pgBrowserChrome()">
			<div :class="pgBrowserDots()" aria-hidden="true">
				<span :class="pgBrowserDot({ tone: 'red' })" />
				<span :class="pgBrowserDot({ tone: 'yellow' })" />
				<span :class="pgBrowserDot({ tone: 'green' })" />
			</div>
			<div :class="pgBrowserUrl()">
				<span :class="pgBrowserUrlText()">{{ url }}</span>
				<span :class="pgHmrIndicator()">
					<span v-if="hmrReady" :class="pgHmrDot()" aria-hidden="true" />
					<span>HMR {{ hmrReady ? "ready" : "offline" }}</span>
				</span>
			</div>
			<div :class="pgBrowserActions()">
				<button
					type="button"
					:class="pgBrowserAction()"
					:aria-label="viewportLabel"
					:title="viewportLabel"
					@click="onToggleViewport"
				>
					<Icon :name="viewportIcon" :size="14" />
				</button>
				<button
					type="button"
					:class="pgBrowserAction()"
					aria-label="Refresh preview"
					title="Refresh preview"
					@click="emit('refresh')"
				>
					<Icon name="reload" :size="14" />
				</button>
				<button
					type="button"
					:class="pgBrowserAction()"
					:disabled="!srcdoc"
					aria-label="Open preview in new tab"
					title="Open preview in new tab"
					@click="openInNewTab"
				>
					<Icon name="external" :size="14" />
				</button>
			</div>
		</div>
		<div :class="pgBrowserViewport()">
			<div :class="pgBrowserViewportFrame({ size: viewport })">
				<slot />
			</div>
		</div>
	</div>
</template>
