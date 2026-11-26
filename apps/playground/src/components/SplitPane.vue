<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
	pgSplitPane,
	pgSplitPaneDivider,
	pgSplitPanePane,
} from "virtual:styleframe";

const props = withDefaults(
	defineProps<{
		initial?: number;
		min?: number;
		max?: number;
		/** Preferred starting width of the right pane, in pixels (best effort). */
		initialRightWidth?: number;
	}>(),
	{ initial: 50, min: 20, max: 80 },
);

const DIVIDER_WIDTH = 6;
const ratio = ref(props.initial);
const container = ref<HTMLElement | null>(null);

// Convert a desired right-pane pixel width into the ratio used by the split,
// accounting for the divider. Clamps to [min, max] when the window is too small.
onMounted(() => {
	if (props.initialRightWidth == null) {return;}
	const el = container.value;
	if (!el) {return;}
	const width = el.getBoundingClientRect().width - DIVIDER_WIDTH;
	if (width <= 0) {return;}
	const leftRatio = 100 - (props.initialRightWidth / width) * 100;
	ratio.value = Math.min(props.max, Math.max(props.min, leftRatio));
});

function onPointerDown(event: PointerEvent) {
	(event.target as HTMLElement).setPointerCapture(event.pointerId);
	event.preventDefault();
}

function onPointerMove(event: PointerEvent) {
	if (!(event.buttons & 1)) {return;}
	const el = container.value;
	if (!el) {return;}
	const rect = el.getBoundingClientRect();
	if (rect.width === 0) {return;}
	const next = ((event.clientX - rect.left) / rect.width) * 100;
	ratio.value = Math.min(props.max, Math.max(props.min, next));
}
</script>

<template>
	<div ref="container" :class="pgSplitPane()">
		<div :class="pgSplitPanePane()" :style="{ flexBasis: `${ratio}%` }">
			<slot name="left" />
		</div>
		<div
			:class="pgSplitPaneDivider()"
			role="separator"
			aria-orientation="vertical"
			@pointerdown="onPointerDown"
			@pointermove="onPointerMove"
		/>
		<div :class="pgSplitPanePane()" :style="{ flexBasis: `${100 - ratio}%` }">
			<slot name="right" />
		</div>
	</div>
</template>
