<script setup lang="ts">
import { computed } from "vue";
import { avatarGroup } from "virtual:styleframe";
import Avatar from "./Avatar.vue";

const props = withDefaults(
	defineProps<{
		size?: "xs" | "sm" | "md" | "lg" | "xl";
		count?: number;
	}>(),
	{},
);

const classes = computed(() => avatarGroup({ size: props.size }));
</script>

<template>
	<div :class="classes">
		<slot />
		<Avatar v-if="count" :size="size" color="neutral" variant="soft" :label="`+${count}`" />
	</div>
</template>
