<script setup lang="ts">
import Button from "../Button.vue";
import ButtonPreviewIcon from "./ButtonPreviewIcon.vue";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
</script>

<template>
	<div class="button-section">
		<div v-for="size in sizes" :key="size">
			<div class="button-label">{{ size }}</div>
			<div class="button-row">
				<Button color="primary" :size="size" label="Search">
					<template #leading>
						<ButtonPreviewIcon name="search" />
					</template>
				</Button>
				<Button color="primary" variant="outline" :size="size" label="Continue">
					<template #trailing>
						<ButtonPreviewIcon name="arrow" />
					</template>
				</Button>
				<Button color="primary" variant="soft" :size="size" label="No icon" />
			</div>
		</div>
	</div>
</template>
