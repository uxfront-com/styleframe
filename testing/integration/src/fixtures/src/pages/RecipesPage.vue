<script setup lang="ts">
import { badge } from "virtual:styleframe";

const defaultBadge = badge();
const errorOutlineBadge = badge({
	color: "error",
	variant: "outline",
	size: "md",
});
const successSoftBadge = badge({
	color: "success",
	variant: "soft",
	size: "lg",
});
</script>

<template>
	<span id="test-badge-default" :class="defaultBadge">Default</span>
	<span id="test-badge-error-outline" :class="errorOutlineBadge">Error Outline</span>
	<span id="test-badge-success-soft" :class="successSoftBadge">Success Soft</span>
</template>
