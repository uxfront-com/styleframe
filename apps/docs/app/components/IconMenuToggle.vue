<script setup lang="ts">
/**
 * Replaces Docus's IconMenuToggle (docus/app/components/IconMenuToggle.vue),
 * the header's menu button on smaller screens, which has no accessible name.
 * It takes Nuxt UI's own "Open menu" and "Close menu" labels, as UHeader's
 * default toggle does, and says whether the menu is open. Its three lines turn
 * into a cross with CSS, where Docus's animate with motion-v, which isn't the
 * app's dependency, and they don't move for readers who prefer reduced motion.
 */
import { useLocale } from "#ui/composables/useLocale";

defineProps<{ open: boolean }>();

const { t } = useLocale();
</script>

<template>
	<UButton
		size="sm"
		variant="ghost"
		color="neutral"
		class="-me-1.5"
		square
		:aria-label="open ? t('header.close') : t('header.open')"
		:aria-expanded="open"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="size-5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<line
				x1="4"
				y1="6"
				x2="20"
				y2="6"
				class="origin-center transition-transform duration-300 transform-fill motion-reduce:transition-none"
				:class="{ 'translate-y-1.5 rotate-45': open }"
			/>
			<line
				x1="4"
				y1="12"
				x2="20"
				y2="12"
				class="transition-opacity duration-300 motion-reduce:transition-none"
				:class="{ 'opacity-0': open }"
			/>
			<line
				x1="4"
				y1="18"
				x2="20"
				y2="18"
				class="origin-center transition-transform duration-300 transform-fill motion-reduce:transition-none"
				:class="{ '-translate-y-1.5 -rotate-45': open }"
			/>
		</svg>
	</UButton>
</template>
