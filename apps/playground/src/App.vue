<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
	pgRunButton,
	pgThemeToggle,
	pgToolbar,
	pgToolbarSection,
} from "virtual:styleframe";
import { version as styleframeVersion } from "styleframe/package.json";
import { useTheme } from "@/state/theme";
import BrandMark from "@/components/BrandMark.vue";
import EditorPane from "@/components/EditorPane.vue";
import FileTree from "@/components/FileTree.vue";
import Icon from "@/components/Icon.vue";
import OutputPane from "@/components/OutputPane.vue";
import SplitPane from "@/components/SplitPane.vue";
import StatusBar from "@/components/StatusBar.vue";
import type { EditorSelectionState } from "@/editor/codemirror";
import { runPipeline } from '@/pipeline/pipeline';
import type { PipelineResult } from '@/pipeline/pipeline';
import {
	closeFile,
	CONFIG_PATH,
	ENTRY_PATH,
	openFile,
	setActivePath,
	usePlaygroundState,
} from "@/state/playground";

const state = usePlaygroundState();
const { mode, toggle } = useTheme();

const themeIcon = computed(() => {
	if (mode.value === "light") {return "sun";}
	if (mode.value === "dark") {return "moon";}
	return "contrast";
});

const themeLabel = computed(() => {
	if (mode.value === "light") {return "Theme: Light";}
	if (mode.value === "dark") {return "Theme: Dark";}
	return "Theme: Auto";
});

const languageLabel = computed(() => {
	const path = state.activePath;
	if (!path) {return "—";}
	if (path.endsWith(".css")) {return "CSS";}
	if (path.endsWith(".tsx") || path.endsWith(".jsx")) {return "TSX";}
	if (path.endsWith(".ts")) {return "TypeScript";}
	return "Plain Text";
});

const selection = ref<EditorSelectionState>({ line: 1, column: 1 });
const running = ref(false);

const dirty = computed<Record<string, boolean>>(() => {
	const result: Record<string, boolean> = {};
	for (const path of Object.keys(state.files)) {
		result[path] = state.files[path] !== state.lastBuiltFiles[path];
	}
	return result;
});

const canRun = computed(() => {
	if (state.error) {return true;}
	const current = state.files;
	const built = state.lastBuiltFiles;
	const currentKeys = Object.keys(current);
	if (currentKeys.length !== Object.keys(built).length) {return true;}
	return currentKeys.some((key) => current[key] !== built[key]);
});

const scanSummary = computed(() => {
	const scan = state.scan;
	if (!scan) {return "";}
	const matched = scan.diagnostics.filter((d) => d.factoryFound).length;
	const unmatched = scan.diagnostics.length - matched;
	const registered = scan.registered.length;
	const parts: Array<string> = [];
	parts.push(`scan: ${scan.diagnostics.length}`);
	if (registered > 0) {parts.push(`+${registered}`);}
	if (unmatched > 0) {parts.push(`${unmatched} unmatched`);}
	return parts.join(" · ");
});

function onSelectionChange(next: EditorSelectionState) {
	selection.value = next;
}

let revokePrevious: (() => void) | null = null;

async function rebuild() {
	const built = { ...state.files };
	const result: PipelineResult = await runPipeline({
		files: built,
		configPath: CONFIG_PATH,
		entryPath: ENTRY_PATH,
	});
	if (!result.ok) {
		state.error = `[${result.stage}] ${result.error.message}`;
		return;
	}
	if (revokePrevious) {revokePrevious();}
	revokePrevious = result.revoke;
	state.output.css = result.css;
	state.output.runtimeTs = result.runtimeTs;
	state.output.srcdoc = result.srcdoc;
	state.scan = result.scan;
	state.error = null;
	state.lastBuiltFiles = built;
}

async function run() {
	if (running.value) {return;}
	running.value = true;
	const minDelay = new Promise<void>((resolve) => {
		setTimeout(resolve, 400);
	});
	try {
		await Promise.all([rebuild(), minDelay]);
	} finally {
		running.value = false;
	}
}

function onChange(payload: { id: string; value: string }) {
	state.files[payload.id] = payload.value;
}

function onKeyDown(event: KeyboardEvent) {
	const mod = event.metaKey || event.ctrlKey;
	if (
		mod &&
		!event.altKey &&
		!event.shiftKey &&
		event.key.toLowerCase() === "s"
	) {
		event.preventDefault();
		void run();
	}
}

onMounted(() => {
	window.addEventListener("keydown", onKeyDown);
	void rebuild();
});

onBeforeUnmount(() => {
	window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
	<header :class="pgToolbar()">
		<div :class="pgToolbarSection()">
			<BrandMark />
		</div>
		<div :class="pgToolbarSection()">
			<button
				type="button"
				:class="pgThemeToggle()"
				:aria-label="themeLabel"
				:title="themeLabel"
				@click="toggle"
			>
				<Icon :name="themeIcon" :size="16" />
			</button>
			<button
				type="button"
				:class="pgRunButton()"
				:disabled="running || !canRun"
				aria-label="Run (Ctrl/Cmd+S)"
				title="Run (Ctrl/Cmd+S)"
				@click="run"
			>
				<Icon :name="running ? 'spinner' : 'play'" :size="12" />
				<span>{{ running ? "Running…" : "Save and Run" }}</span>
			</button>
		</div>
	</header>
	<div style="flex: 1 1 auto; min-height: 0; display: flex">
		<div style="flex: 1 1 auto; min-width: 0">
			<SplitPane :initial="60" :min="25" :max="80" :initial-right-width="860">
				<template #left>
					<EditorPane
						:files="state.files"
						:open="state.openPaths"
						:active="state.activePath"
						:dirty="dirty"
						@update:active="(value) => setActivePath(value)"
						@close="(value) => closeFile(value)"
						@change="onChange"
						@selection-change="onSelectionChange"
					/>
				</template>
				<template #right>
					<OutputPane
						:active="state.activeOutput"
						:srcdoc="state.output.srcdoc"
						:css="state.output.css"
						:js="state.output.runtimeTs"
						:error="state.error"
						@update:active="(value) => (state.activeOutput = value)"
						@runtime-error="(message) => (state.error = message)"
						@dismiss-error="() => (state.error = null)"
					/>
				</template>
			</SplitPane>
		</div>
		<FileTree
			:files="state.files"
			:folders="state.folders"
			:active="state.activePath"
			:dirty="dirty"
			@select="(value) => openFile(value)"
		/>
	</div>
	<StatusBar
		:line="selection.line"
		:column="selection.column"
		:language="languageLabel"
		indent="Spaces: 2"
		encoding="UTF-8"
		eol="LF"
		:version="`v${styleframeVersion}`"
		:problems="state.error ? 1 : 0"
		:scan-summary="scanSummary"
	/>
</template>
