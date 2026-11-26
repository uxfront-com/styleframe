<script setup lang="ts">
import Skeleton from "../Skeleton.vue";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
</script>

<template>
	<div class="skeleton-section">
		<div>
			<div class="skeleton-label">Default (rectangular)</div>
			<div class="skeleton-row">
				<Skeleton v-for="size in sizes" :key="size" :size="size" style="width: 200px" />
			</div>
		</div>
		<div>
			<div class="skeleton-label">Rounded (pill/circle)</div>
			<div class="skeleton-row">
				<Skeleton
					v-for="size in sizes"
					:key="`rounded-${size}`"
					:size="size"
					:rounded="true"
					style="width: 200px"
				/>
			</div>
		</div>
	</div>
</template>
