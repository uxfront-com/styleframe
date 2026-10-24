<script setup lang="ts">
// A muted, looping demo video. Only its poster loads with the page: the video
// itself loads and plays once it scrolls into view, unless the visitor
// prefers reduced motion, who gets the controls instead.
defineProps<{
	src: string;
	poster: string;
	width: number;
	height: number;
	label: string;
}>();

const video = useTemplateRef("video");
const reducedMotion = ref(false);
let observer: IntersectionObserver | undefined;

onMounted(() => {
	const el = video.value!;
	reducedMotion.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (reducedMotion.value) return;
	observer = new IntersectionObserver(([entry]) => {
		if (entry?.isIntersecting) el.play().catch(() => {});
		else el.pause();
	});
	observer.observe(el);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
	<video
		ref="video"
		class="site-video"
		:poster="poster"
		:width="width"
		:height="height"
		:aria-label="label"
		:controls="reducedMotion"
		preload="none"
		muted
		loop
		playsinline
	>
		<source :src="src" type="video/mp4" />
	</video>
</template>

<style scoped>
.site-video {
	display: block;
	width: 100%;
	height: auto;
	border: 1px solid var(--ux-line-strong);
	border-radius: 6px;
	background: var(--ux-bg);
}
</style>
