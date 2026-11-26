<script setup lang="ts">
import Drawer from "../Drawer.vue";
import DrawerOverlay from "../DrawerOverlay.vue";
import DrawerHeader from "../DrawerHeader.vue";
import DrawerBody from "../DrawerBody.vue";
import DrawerTitle from "../DrawerTitle.vue";
import DrawerDescription from "../DrawerDescription.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="drawer-size-grid">
		<div v-for="size in sizes" :key="size">
			<div class="drawer-label">{{ sizeTitles[size] }} ({{ size }})</div>
			<div class="drawer-stage">
				<DrawerOverlay>
					<Drawer :size="size" side="right">
						<DrawerHeader :size="size">
							<DrawerTitle>{{ sizeTitles[size] }} Drawer</DrawerTitle>
						</DrawerHeader>
						<DrawerBody :size="size">
							<DrawerDescription> The {{ size }} size sets the panel thickness. </DrawerDescription>
						</DrawerBody>
					</Drawer>
				</DrawerOverlay>
			</div>
		</div>
	</div>
</template>
