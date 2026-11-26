<script setup lang="ts">
import Dropdown from "../Dropdown.vue";
import DropdownArrow from "../DropdownArrow.vue";
import DropdownItem from "../DropdownItem.vue";
import DropdownLabel from "../DropdownLabel.vue";
import DropdownSeparator from "../DropdownSeparator.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
</script>

<template>
	<div class="dropdown-section">
		<div v-for="variant in variants" :key="variant">
			<div class="dropdown-label">{{ variant }}</div>
			<div class="dropdown-row">
				<div v-for="color in colors" :key="`${variant}-${color}`" class="dropdown-wrapper">
					<Dropdown :color="color" :variant="variant">
						<DropdownLabel :color="color"> {{ variant }} {{ color }} </DropdownLabel>
						<DropdownItem :color="color" :variant="variant">Profile</DropdownItem>
						<DropdownItem :color="color" :variant="variant">Settings</DropdownItem>
						<DropdownSeparator :color="color" />
						<DropdownItem :color="color" :variant="variant">Sign out</DropdownItem>
					</Dropdown>
					<DropdownArrow :color="color" :variant="variant" class="dropdown-arrow-position" />
				</div>
			</div>
		</div>
	</div>
</template>
