<script setup lang="ts">
import Pagination from "../Pagination.vue";
import PaginationItem from "../PaginationItem.vue";
import PaginationEllipsis from "../PaginationEllipsis.vue";

const sizes = ["sm", "md", "lg"] as const;
</script>

<template>
	<div class="pagination-section">
		<div v-for="size in sizes" :key="size">
			<div class="pagination-label">{{ size }}</div>
			<Pagination :size="size">
				<PaginationItem :size="size" href="#" aria-label="Previous page"> ‹ </PaginationItem>
				<PaginationItem :size="size" href="#">1</PaginationItem>
				<PaginationItem :size="size" href="#" active>2</PaginationItem>
				<PaginationItem :size="size" href="#">3</PaginationItem>
				<PaginationEllipsis :size="size" />
				<PaginationItem :size="size" href="#">9</PaginationItem>
				<PaginationItem :size="size" href="#" aria-label="Next page"> › </PaginationItem>
			</Pagination>
		</div>
	</div>
</template>
