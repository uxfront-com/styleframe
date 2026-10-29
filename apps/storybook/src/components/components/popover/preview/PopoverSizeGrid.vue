<script setup lang="ts">
import Popover from "../Popover.vue";
import PopoverHeader from "../PopoverHeader.vue";
import PopoverBody from "../PopoverBody.vue";
import PopoverFooter from "../PopoverFooter.vue";
import PopoverTitle from "../PopoverTitle.vue";
import PopoverDescription from "../PopoverDescription.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="popover-section">
		<div v-for="size in sizes" :key="size">
			<div class="popover-label">{{ size }}</div>
			<div class="popover-row">
				<Popover
					v-for="color in colors"
					:key="`${size}-${color}`"
					:color="color"
					:size="size"
					class="popover-demo-narrow"
				>
					<PopoverHeader :color="color" :size="size">
						<PopoverTitle
							>{{ sizeTitles[size] }}
							{{ color.charAt(0).toUpperCase() + color.slice(1) }}</PopoverTitle
						>
					</PopoverHeader>
					<PopoverBody :size="size">
						<PopoverDescription
							>This is a {{ size }} {{ color }} popover.</PopoverDescription
						>
					</PopoverBody>
					<PopoverFooter :color="color" :size="size">
						Footer content
					</PopoverFooter>
				</Popover>
			</div>
		</div>
	</div>
</template>
