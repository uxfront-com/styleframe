<script setup lang="ts">
import { ref } from "vue";
import { pgEditorShell, pgEditorSurface } from "virtual:styleframe";
import BrowserChrome from "./BrowserChrome.vue";
import CodeOutput from "./CodeOutput.vue";
import ErrorBanner from "./ErrorBanner.vue";
import PreviewFrame from "./PreviewFrame.vue";
import TabList from "./TabList.vue";

type OutputId = "preview" | "css" | "js";

const props = defineProps<{
	active: OutputId;
	srcdoc: string;
	css: string;
	js: string;
	error: string | null;
}>();

const emit = defineEmits<{
	"update:active": [value: OutputId];
	"runtime-error": [message: string];
	"dismiss-error": [];
}>();

const tabs: ReadonlyArray<{ id: OutputId; label: string }> = [
	{ id: "preview", label: "Preview" },
	{ id: "css", label: "CSS Output" },
	{ id: "js", label: "JS Output" },
];

const refreshKey = ref(0);
const viewport = ref<"mobile" | "tablet" | "desktop">("desktop");
</script>

<template>
	<div :class="pgEditorShell()">
		<TabList
			:tabs="tabs"
			:model-value="active"
			@update:model-value="(value) => emit('update:active', value)"
		/>
		<div :class="pgEditorSurface()" style="position: relative">
			<div v-show="active === 'preview'" style="height: 100%">
				<BrowserChrome
					url="localhost:5173"
					:hmr-ready="true"
					:srcdoc="props.srcdoc"
					v-model:viewport="viewport"
					@refresh="refreshKey++"
				>
					<PreviewFrame
						:key="refreshKey"
						:srcdoc="props.srcdoc"
						@runtime-error="(message) => emit('runtime-error', message)"
					/>
				</BrowserChrome>
			</div>
			<div
				v-show="active === 'css'"
				style="display: flex; flex-direction: column; height: 100%; min-height: 0"
			>
				<CodeOutput :value="props.css" language="css" />
			</div>
			<div
				v-show="active === 'js'"
				style="display: flex; flex-direction: column; height: 100%; min-height: 0"
			>
				<CodeOutput :value="props.js" language="typescript" />
			</div>
			<ErrorBanner v-if="error" :message="error" @dismiss="emit('dismiss-error')" />
		</div>
	</div>
</template>
