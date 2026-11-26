<script setup lang="ts">
import ContextMenu from "../ContextMenu.vue";
import ContextMenuCheckboxItem from "../ContextMenuCheckboxItem.vue";
import ContextMenuItem from "../ContextMenuItem.vue";
import ContextMenuLabel from "../ContextMenuLabel.vue";
import ContextMenuSeparator from "../ContextMenuSeparator.vue";
import ContextMenuShortcut from "../ContextMenuShortcut.vue";
import ContextMenuSubTrigger from "../ContextMenuSubTrigger.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
</script>

<template>
	<div class="context-menu-section">
		<div v-for="variant in variants" :key="variant">
			<div class="context-menu-demo-label">{{ variant }}</div>
			<div class="context-menu-row">
				<ContextMenu
					v-for="color in colors"
					:key="`${variant}-${color}`"
					:color="color"
					:variant="variant"
				>
					<ContextMenuLabel :color="color"> {{ variant }} {{ color }} </ContextMenuLabel>
					<ContextMenuItem :color="color" :variant="variant">
						Back
						<ContextMenuShortcut :color="color">⌘[</ContextMenuShortcut>
					</ContextMenuItem>
					<ContextMenuItem :color="color" :variant="variant" disabled> Forward </ContextMenuItem>
					<ContextMenuSeparator :color="color" />
					<ContextMenuCheckboxItem :color="color" :variant="variant" :checked="true">
						Bookmarks
					</ContextMenuCheckboxItem>
					<ContextMenuSubTrigger :color="color" :variant="variant">
						More Tools
					</ContextMenuSubTrigger>
					<ContextMenuSeparator :color="color" />
					<ContextMenuItem :color="color" :variant="variant" destructive> Delete </ContextMenuItem>
				</ContextMenu>
			</div>
		</div>
	</div>
</template>
