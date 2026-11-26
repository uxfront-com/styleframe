<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { avatar } from "virtual:styleframe";
import AvatarBadge from "./AvatarBadge.vue";

const props = withDefaults(
	defineProps<{
		color?: "primary" | "light" | "dark" | "neutral";
		variant?: "solid" | "soft";
		size?: "xs" | "sm" | "md" | "lg" | "xl";
		shape?: "circle" | "square";
		src?: string;
		alt?: string;
		label?: string;
		status?:
			| "primary"
			| "secondary"
			| "success"
			| "info"
			| "warning"
			| "error"
			| "light"
			| "dark"
			| "neutral";
		statusPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	}>(),
	{},
);

const classes = computed(() =>
	avatar({
		color: props.color,
		variant: props.variant,
		size: props.size,
		shape: props.shape,
	}),
);

// Fall back to initials when the image is missing or fails to load.
const failed = ref(false);
watch(
	() => props.src,
	() => {
		failed.value = false;
	},
);
const showImage = computed(() => Boolean(props.src) && !failed.value);
</script>

<template>
	<span :class="classes">
		<img v-if="showImage" :src="src" :alt="alt" @error="failed = true" />
		<template v-else>
			<slot>{{ label }}</slot>
		</template>
		<AvatarBadge v-if="status" :color="status" :size="size" :position="statusPosition" />
	</span>
</template>
