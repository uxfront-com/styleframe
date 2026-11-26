<script setup lang="ts">
import { computed } from "vue";
import {
	pgBrandBadge,
	pgBrandLink,
	pgBrandLogotype,
	pgBrandMark,
} from "virtual:styleframe";
import logotypeDark from "@/assets/logotype-dark.svg?url";
import logotypeLight from "@/assets/logotype-light.svg?url";
import { useTheme } from "@/state/theme";

const { resolved } = useTheme();
const logotypeSrc = computed(() =>
	resolved.value === "dark" ? logotypeDark : logotypeLight,
);

function onLogoClick(event: MouseEvent) {
	if (!window.confirm("Are you sure you want to leave the playground?")) {
		event.preventDefault();
	}
}
</script>

<template>
	<div :class="pgBrandMark()">
		<a
			:class="pgBrandLink()"
			href="https://styleframe.dev"
			aria-label="Go to styleframe.dev"
			@click="onLogoClick"
		>
			<img :class="pgBrandLogotype()" :src="logotypeSrc" alt="Styleframe" draggable="false" />
		</a>
		<span :class="pgBrandBadge()">Playground</span>
	</div>
</template>
