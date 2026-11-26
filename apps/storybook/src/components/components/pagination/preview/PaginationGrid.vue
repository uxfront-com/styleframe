<script setup lang="ts">
import Pagination from "../Pagination.vue";
import PaginationItem from "../PaginationItem.vue";
import PaginationEllipsis from "../PaginationEllipsis.vue";

const colors = ["light", "dark", "neutral"] as const;
const variants = [
	"solid",
	"outline",
	"soft",
	"subtle",
	"ghost",
	"link",
] as const;
</script>

<template>
	<div class="pagination-section">
		<div v-for="variant in variants" :key="variant">
			<hr />
			<div class="pagination-label">{{ variant }}</div>
			<hr />
			<div class="pagination-row">
				<div v-for="color in colors" :key="`${variant}-${color}`">
					<Pagination>
						<PaginationItem :color="color" :variant="variant" href="#" aria-label="Previous page">
							‹
						</PaginationItem>
						<PaginationItem :color="color" :variant="variant" href="#"> 1 </PaginationItem>
						<PaginationItem :color="color" :variant="variant" href="#" active> 2 </PaginationItem>
						<PaginationItem :color="color" :variant="variant" href="#"> 3 </PaginationItem>
						<PaginationEllipsis />
						<PaginationItem :color="color" :variant="variant" href="#"> 9 </PaginationItem>
						<PaginationItem :color="color" :variant="variant" href="#" aria-label="Next page">
							›
						</PaginationItem>
					</Pagination>
				</div>
			</div>
		</div>
	</div>
</template>
