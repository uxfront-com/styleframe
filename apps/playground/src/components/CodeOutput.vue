<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { pgEditorSurface } from "virtual:styleframe";
import type { EditorView } from "@codemirror/view";
import { createEditor, setEditorTheme, setEditorValue } from '@/editor/codemirror';
import type { EditorLanguage } from '@/editor/codemirror';
import { useTheme } from "@/state/theme";

const props = defineProps<{
	value: string;
	language: EditorLanguage;
}>();

const host = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;
const { resolved } = useTheme();

onMounted(() => {
	if (!host.value) {return;}
	view = createEditor({
		parent: host.value,
		doc: props.value,
		language: props.language,
		theme: resolved.value,
		readOnly: true,
	});
});

onBeforeUnmount(() => {
	view?.destroy();
	view = null;
});

watch(
	() => props.value,
	(next) => {
		if (view) {setEditorValue(view, next);}
	},
);

watch(resolved, (next) => {
	if (view) {setEditorTheme(view, next);}
});
</script>

<template>
	<div ref="host" :class="pgEditorSurface()" />
</template>
