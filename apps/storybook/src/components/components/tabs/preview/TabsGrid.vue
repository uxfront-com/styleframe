<script setup lang="ts">
import Tabs from "../Tabs.vue";
import TabsContent from "../TabsContent.vue";
import TabsList from "../TabsList.vue";
import TabsTrigger from "../TabsTrigger.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["line", "pill", "soft"] as const;
</script>

<template>
	<div class="tabs-section">
		<div v-for="variant in variants" :key="variant">
			<div class="tabs-label">{{ variant }}</div>
			<div class="tabs-row">
				<div
					v-for="color in colors"
					:key="`${variant}-${color}`"
					class="tabs-demo"
					:class="{ '-dark': color === 'dark' }"
				>
					<Tabs :color="color" :variant="variant" model-value="overview">
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="activity">Activity</TabsTrigger>
						</TabsList>
						<TabsContent value="overview"> {{ color }} / {{ variant }} </TabsContent>
						<TabsContent value="activity">Activity panel</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	</div>
</template>
