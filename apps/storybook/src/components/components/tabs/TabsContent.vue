<script setup lang="ts">
import { computed } from "vue";
import { tabsContent } from "virtual:styleframe";
import { useTabsContext } from './context';
import type { TabsSize } from './context';

const props = defineProps<{
	value: string;
	size?: TabsSize;
}>();

const ctx = useTabsContext();

const size = computed(() => props.size ?? ctx?.size.value ?? "md");
const selected = computed(() => ctx?.active.value === props.value);

const classes = computed(() => tabsContent({ size: size.value }));
</script>

<template>
	<div
		v-show="selected"
		role="tabpanel"
		:data-state="selected ? 'active' : 'inactive'"
		:class="classes"
	>
		<slot />
	</div>
</template>
