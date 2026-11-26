<script setup lang="ts">
import Tabs from "../Tabs.vue";
import TabsContent from "../TabsContent.vue";
import TabsList from "../TabsList.vue";
import TabsTrigger from "../TabsTrigger.vue";

const sizes = ["sm", "md", "lg"] as const;
const variants = ["line", "pill", "soft"] as const;
</script>

<template>
	<div class="tabs-section">
		<div v-for="size in sizes" :key="size">
			<div class="tabs-label">{{ size }}</div>
			<div class="tabs-row">
				<div v-for="variant in variants" :key="`${size}-${variant}`" class="tabs-demo">
					<Tabs :size="size" :variant="variant" model-value="overview">
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="activity">Activity</TabsTrigger>
						</TabsList>
						<TabsContent value="overview">{{ size }} / {{ variant }}</TabsContent>
						<TabsContent value="activity">Activity panel</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	</div>
</template>
