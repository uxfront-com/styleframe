<script setup lang="ts">
import Drawer from "../Drawer.vue";
import DrawerOverlay from "../DrawerOverlay.vue";
import DrawerHeader from "../DrawerHeader.vue";
import DrawerBody from "../DrawerBody.vue";
import DrawerFooter from "../DrawerFooter.vue";
import DrawerTitle from "../DrawerTitle.vue";
import DrawerDescription from "../DrawerDescription.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;

function titleCase(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
</script>

<template>
	<div class="drawer-section">
		<div v-for="variant in variants" :key="variant">
			<div class="drawer-label">{{ variant }}</div>
			<div class="drawer-grid">
				<div v-for="color in colors" :key="`${variant}-${color}`" class="drawer-stage">
					<DrawerOverlay>
						<Drawer :color="color" :variant="variant" size="sm">
							<DrawerHeader :color="color" :variant="variant">
								<DrawerTitle>{{ titleCase(variant) }} {{ titleCase(color) }}</DrawerTitle>
							</DrawerHeader>
							<DrawerBody :color="color" :variant="variant">
								<DrawerDescription> This is a {{ variant }} {{ color }} drawer. </DrawerDescription>
							</DrawerBody>
							<DrawerFooter :color="color" :variant="variant"> Footer content </DrawerFooter>
						</Drawer>
					</DrawerOverlay>
				</div>
			</div>
		</div>
	</div>
</template>
