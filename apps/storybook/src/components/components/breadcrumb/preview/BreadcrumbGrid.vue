<script setup lang="ts">
import Breadcrumb from "../Breadcrumb.vue";
import BreadcrumbItem from "../BreadcrumbItem.vue";

const colors = ["light", "dark", "neutral"] as const;
</script>

<template>
	<div class="breadcrumb-section">
		<div v-for="color in colors" :key="color">
			<hr />
			<div class="breadcrumb-label">{{ color }}</div>
			<hr />
			<div class="breadcrumb-row">
				<Breadcrumb>
					<BreadcrumbItem :color="color" href="#">Home</BreadcrumbItem>
					<BreadcrumbItem :color="color" href="#">Library</BreadcrumbItem>
					<BreadcrumbItem :color="color" href="#" disabled> Archive </BreadcrumbItem>
					<BreadcrumbItem :color="color" active>Current</BreadcrumbItem>
				</Breadcrumb>
			</div>
		</div>
	</div>
</template>
