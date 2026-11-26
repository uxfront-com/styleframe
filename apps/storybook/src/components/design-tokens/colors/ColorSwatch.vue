<script setup lang="ts">
import { ref as vueRef, onMounted, onUnmounted } from "vue";
import { colorSwatch } from "virtual:styleframe";
import SwatchCard from "../../primitives/SwatchCard.vue";
import { themeEventBus } from "../../../utils/themeEventBus";

const props = defineProps<{
	name: string;
	value: string;
	label?: string;
	interactive?: boolean;
}>();

const previewEl = vueRef<HTMLElement | null>(null);
const hexValue = vueRef<string>("");
const textContrastRatio = vueRef<number | null>(null);
const textPassesAA = vueRef(false);
const textPassesAAA = vueRef(false);
const adjacentContrastRatio = vueRef<number | null>(null);
const adjacentPassesAA = vueRef(false);

function parseColor(color: string): [number, number, number] {
	const ctx = document.createElement("canvas").getContext("2d")!;
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 1, 1);
	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
	return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
	return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function relativeLuminance(r: number, g: number, b: number): number {
	const [rs, gs, bs] = [r, g, b].map((c) => {
		const s = c / 255;
		return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1: number, l2: number): number {
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

function deferredUpdateContrastRatios() {
	requestAnimationFrame(updateContrastRatios);
}

function updateContrastRatios() {
	if (!previewEl.value) {return;}

	const bg = getComputedStyle(previewEl.value).backgroundColor;
	const fg = getComputedStyle(previewEl.value).color;
	const pageBg = getComputedStyle(document.body).backgroundColor;

	const bgRgb = parseColor(bg);
	hexValue.value = rgbToHex(...bgRgb);

	const bgLum = relativeLuminance(...bgRgb);
	const fgLum = relativeLuminance(...parseColor(fg));
	const pageBgLum = relativeLuminance(...parseColor(pageBg));

	const textRatio = getContrastRatio(bgLum, fgLum);
	textContrastRatio.value = Math.round(textRatio * 100) / 100;
	textPassesAA.value = textRatio >= 4.5;
	textPassesAAA.value = textRatio >= 7;

	const adjacentRatio = getContrastRatio(bgLum, pageBgLum);
	adjacentContrastRatio.value = Math.round(adjacentRatio * 100) / 100;
	adjacentPassesAA.value = adjacentRatio >= 3;
}

const interactionEvents = [
	"mouseenter",
	"mouseleave",
	"focus",
	"blur",
	"mousedown",
	"mouseup",
	"transitionend",
] as const;

onMounted(() => {
	updateContrastRatios();
	themeEventBus.on("theme-change", updateContrastRatios);

	if (props.interactive && previewEl.value) {
		for (const event of interactionEvents) {
			previewEl.value.addEventListener(event, deferredUpdateContrastRatios);
		}
	}
});

onUnmounted(() => {
	themeEventBus.off("theme-change", updateContrastRatios);

	if (props.interactive && previewEl.value) {
		for (const event of interactionEvents) {
			previewEl.value.removeEventListener(event, deferredUpdateContrastRatios);
		}
	}
});
</script>

<template>
	<SwatchCard :name="name" :label="label">
		<div
			ref="previewEl"
			:tabindex="interactive ? 0 : undefined"
			:class="['color-swatch__preview', colorSwatch({ variant: value, interactive })]"
		>
			{{ hexValue }}
		</div>
		<template #label>
			<div class="color-swatch__name">color.{{ name }}</div>
			<div class="color-swatch__checks">
				<div class="color-swatch__check">
					<span class="color-swatch__check-label">Text</span>
					<span class="color-swatch__check-ratio"
						>{{ textContrastRatio ?? '–' }}:1</span
					>
					<span
						:class="['color-swatch__check-badge', textPassesAAA || textPassesAA ? '_color:success' : '_color:error']"
					>
						{{ textPassesAAA ? 'AAA ✓' : textPassesAA ? 'AA ✓' : 'AA ✗' }}
					</span>
				</div>
				<div class="color-swatch__check">
					<span class="color-swatch__check-label">Adjacent</span>
					<span class="color-swatch__check-ratio"
						>{{ adjacentContrastRatio ?? '–' }}:1</span
					>
					<span
						:class="['color-swatch__check-badge', adjacentPassesAA ? '_color:success' : '_color:error']"
					>
						{{ adjacentPassesAA ? 'AA ✓' : 'AA ✗' }}
					</span>
				</div>
			</div>
		</template>
	</SwatchCard>
</template>
