<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
	pgEditorEmpty,
	pgEditorShell,
	pgEditorSurface,
} from "virtual:styleframe";
import { createEditor, getEditorSelection, languageForPath, setEditorTheme, setEditorValue } from '@/editor/codemirror';
import type { EditorSelectionState } from '@/editor/codemirror';
import { useTheme } from "@/state/theme";
import type { EditorView } from "@codemirror/view";
import FileTabList from './FileTabList.vue';
import type { FileTabEntry } from './FileTabList.vue';

const props = defineProps<{
	files: Record<string, string>;
	/** Paths of the open tabs, in order. */
	open: Array<string>;
	active: string;
	dirty?: Record<string, boolean>;
}>();

const emit = defineEmits<{
	"update:active": [value: string];
	close: [value: string];
	change: [payload: { id: string; value: string }];
	"selection-change": [state: EditorSelectionState];
}>();

const host = ref<HTMLDivElement | null>(null);
const views = new Map<string, EditorView>();
const { resolved } = useTheme();

function basename(path: string): string {
	return path.split("/").pop() ?? path;
}

const tabs = computed<Array<FileTabEntry<string>>>(() =>
	props.open.map((path) => ({ id: path, label: basename(path) })),
);

function mountEditor(path: string) {
	if (!host.value || !path || views.has(path)) {return;}
	const container = document.createElement("div");
	container.style.height = "100%";
	container.style.display = path === props.active ? "block" : "none";
	container.dataset.editorFor = path;
	host.value.append(container);
	const view = createEditor({
		parent: container,
		doc: props.files[path] ?? "",
		language: languageForPath(path),
		theme: resolved.value,
		onChange(value) {
			emit("change", { id: path, value });
		},
		onSelectionChange(state) {
			if (props.active === path) {emit("selection-change", state);}
		},
	});
	views.set(path, view);
}

function destroyEditor(path: string) {
	const view = views.get(path);
	if (!view) {return;}
	const container = view.dom.parentElement;
	view.destroy();
	container?.remove();
	views.delete(path);
}

function showActive(path: string) {
	if (!host.value) {return;}
	for (const child of Array.from(host.value.children)) {
		const editorFor = (child as HTMLElement).dataset.editorFor;
		if (!editorFor) {continue;}
		(child as HTMLElement).style.display =
			editorFor === path ? "block" : "none";
	}
	const view = views.get(path);
	view?.focus();
	if (view) {emit("selection-change", getEditorSelection(view));}
}

onMounted(() => {
	mountEditor(props.active);
	showActive(props.active);
});

onBeforeUnmount(() => {
	for (const view of views.values()) {view.destroy();}
	views.clear();
});

// Lazily mount the active file's editor the first time it is focused.
watch(
	() => props.active,
	(next) => {
		mountEditor(next);
		showActive(next);
	},
);

// Tear down editors for files that were deleted from the project.
watch(
	() => Object.keys(props.files).join(" "),
	() => {
		// Snapshot keys — destroyEditor() mutates `views` during iteration.
		for (const path of Array.from(views.keys())) {
			if (!(path in props.files)) {destroyEditor(path);}
		}
	},
);

// Keep editor contents in sync with external state changes (e.g. resets).
watch(
	() => props.files,
	(next) => {
		for (const [path, view] of views) {
			if (path in next) {setEditorValue(view, next[path] ?? "");}
		}
	},
	{ deep: true },
);

watch(resolved, (next) => {
	for (const view of views.values()) {setEditorTheme(view, next);}
});
</script>

<template>
	<div :class="pgEditorShell()">
		<FileTabList
			:tabs="tabs"
			:model-value="active"
			:dirty="dirty"
			@update:model-value="(value) => emit('update:active', value)"
			@close="(value) => emit('close', value)"
		/>
		<div :class="pgEditorSurface()">
			<div ref="host" style="height: 100%" />
			<div v-if="!active" :class="pgEditorEmpty()">
				No file open — pick one from the tree on the right.
			</div>
		</div>
	</div>
</template>
