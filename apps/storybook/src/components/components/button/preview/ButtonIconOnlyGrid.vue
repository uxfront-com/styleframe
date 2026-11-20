<script setup lang="ts">
import Button from "../Button.vue";
import ButtonPreviewIcon from "./ButtonPreviewIcon.vue";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const variants = ["solid", "outline", "soft", "ghost"] as const;
</script>

<template>
	<div class="button-section">
		<div v-for="size in sizes" :key="size">
			<div class="button-label">{{ size }}</div>
			<div class="button-row">
				<Button
					v-for="variant in variants"
					:key="`${size}-${variant}`"
					color="primary"
					:variant="variant"
					:size="size"
					:label="`Search (${size}, ${variant})`"
					icon-only
				>
					<template #leading>
						<ButtonPreviewIcon name="search" />
					</template>
				</Button>
			</div>
		</div>
	</div>
</template>
