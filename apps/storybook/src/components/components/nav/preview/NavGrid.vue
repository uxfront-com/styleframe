<script setup lang="ts">
import Nav from "../Nav.vue";
import NavItem from "../NavItem.vue";

const colors = ["light", "dark", "neutral"] as const;
const variants = ["ghost", "link"] as const;
</script>

<template>
	<div class="nav-section">
		<div v-for="variant in variants" :key="variant">
			<hr />
			<div class="nav-label">{{ variant }}</div>
			<hr />
			<div class="nav-row">
				<div v-for="color in colors" :key="`${variant}-${color}`">
					<Nav>
						<NavItem :color="color" :variant="variant" href="#"> Home </NavItem>
						<NavItem :color="color" :variant="variant" href="#" active> About </NavItem>
						<NavItem :color="color" :variant="variant" href="#"> Contact </NavItem>
						<NavItem :color="color" :variant="variant" href="#" disabled> Disabled </NavItem>
					</Nav>
				</div>
			</div>
		</div>
	</div>
</template>
