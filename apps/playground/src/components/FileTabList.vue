<script setup lang="ts" generic="T extends string">
import {
	pgFileTab,
	pgFileTabClose,
	pgFileTabDot,
	pgFileTabList,
} from "virtual:styleframe";
import Icon from "./Icon.vue";

export interface FileTabEntry<Id extends string> {
	id: Id;
	label: string;
}

defineProps<{
	modelValue: T;
	tabs: ReadonlyArray<FileTabEntry<T>>;
	dirty?: Partial<Record<T, boolean>>;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: T];
	close: [value: T];
}>();
</script>

<template>
	<div :class="pgFileTabList()" role="tablist">
		<div
			v-for="tab in tabs"
			:key="tab.id"
			role="tab"
			tabindex="0"
			:aria-selected="modelValue === tab.id"
			:title="tab.id"
			:class="
				pgFileTab({ state: modelValue === tab.id ? 'active' : 'inactive' })
			"
			@click="emit('update:modelValue', tab.id)"
			@keydown.enter="emit('update:modelValue', tab.id)"
		>
			<span v-if="dirty?.[tab.id]" :class="pgFileTabDot()" aria-label="Edited" />
			<span>{{ tab.label }}</span>
			<button
				type="button"
				:class="pgFileTabClose()"
				aria-label="Close tab"
				:title="`Close ${tab.id}`"
				@click.stop="emit('close', tab.id)"
				@keydown.enter.stop="emit('close', tab.id)"
			>
				<Icon name="close" :size="11" />
			</button>
		</div>
	</div>
</template>
