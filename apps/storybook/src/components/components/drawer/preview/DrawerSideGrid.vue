<script setup lang="ts">
import Drawer from "../Drawer.vue";
import DrawerOverlay from "../DrawerOverlay.vue";
import DrawerHeader from "../DrawerHeader.vue";
import DrawerBody from "../DrawerBody.vue";
import DrawerTitle from "../DrawerTitle.vue";
import DrawerDescription from "../DrawerDescription.vue";

const sides = ["left", "right", "top", "bottom"] as const;
</script>

<template>
	<div class="drawer-grid">
		<div v-for="side in sides" :key="side">
			<div class="drawer-label">{{ side }}</div>
			<div class="drawer-stage">
				<DrawerOverlay>
					<Drawer :side="side" size="sm">
						<DrawerHeader>
							<DrawerTitle> {{ side.charAt(0).toUpperCase() + side.slice(1) }} Drawer </DrawerTitle>
						</DrawerHeader>
						<DrawerBody>
							<DrawerDescription> Anchored to the {{ side }} edge. </DrawerDescription>
						</DrawerBody>
					</Drawer>
				</DrawerOverlay>
			</div>
		</div>
	</div>
</template>
