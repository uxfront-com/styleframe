<script setup lang="ts">
import Dropdown from "../Dropdown.vue";
import DropdownArrow from "../DropdownArrow.vue";
import DropdownItem from "../DropdownItem.vue";
import DropdownLabel from "../DropdownLabel.vue";
import DropdownSeparator from "../DropdownSeparator.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="dropdown-section">
		<div v-for="size in sizes" :key="size">
			<div class="dropdown-label">{{ size }}</div>
			<div class="dropdown-row">
				<div v-for="color in colors" :key="`${size}-${color}`" class="dropdown-wrapper">
					<Dropdown :color="color" :size="size">
						<DropdownLabel :color="color" :size="size">
							{{ sizeTitles[size] }} {{ color }}
						</DropdownLabel>
						<DropdownItem :color="color" :size="size">Profile</DropdownItem>
						<DropdownItem :color="color" :size="size">Settings</DropdownItem>
						<DropdownSeparator :color="color" />
						<DropdownItem :color="color" :size="size">Sign out</DropdownItem>
					</Dropdown>
					<DropdownArrow :color="color" class="dropdown-arrow-position" />
				</div>
			</div>
		</div>
	</div>
</template>
