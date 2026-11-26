<script setup lang="ts">
import ContextMenu from "../ContextMenu.vue";
import ContextMenuCheckboxItem from "../ContextMenuCheckboxItem.vue";
import ContextMenuItem from "../ContextMenuItem.vue";
import ContextMenuLabel from "../ContextMenuLabel.vue";
import ContextMenuSeparator from "../ContextMenuSeparator.vue";
import ContextMenuShortcut from "../ContextMenuShortcut.vue";
import ContextMenuSubTrigger from "../ContextMenuSubTrigger.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="context-menu-section">
		<div v-for="size in sizes" :key="size">
			<div class="context-menu-demo-label">{{ sizeTitles[size] }}</div>
			<div class="context-menu-row">
				<ContextMenu :size="size">
					<ContextMenuLabel :size="size">{{ sizeTitles[size] }}</ContextMenuLabel>
					<ContextMenuItem :size="size">
						Back
						<ContextMenuShortcut :size="size">⌘[</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuCheckboxItem :size="size" :checked="true">
						Bookmarks
					</ContextMenuCheckboxItem>
					<ContextMenuSubTrigger :size="size">More Tools</ContextMenuSubTrigger>
					<ContextMenuSeparator />
					<ContextMenuItem :size="size" destructive>Delete</ContextMenuItem>
				</ContextMenu>
			</div>
		</div>
	</div>
</template>
