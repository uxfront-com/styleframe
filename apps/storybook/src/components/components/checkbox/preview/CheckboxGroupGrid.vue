<script setup lang="ts">
import CheckboxGroup from "../CheckboxGroup.vue";
import Checkbox from "../Checkbox.vue";

const orientations = ["vertical", "horizontal"] as const;
</script>

<template>
	<div class="checkbox-section">
		<div v-for="orientation in orientations" :key="orientation">
			<CheckboxGroup
				:orientation="orientation"
				:legend="`Which notifications would you like? (${orientation})`"
			>
				<Checkbox checked label="Email" />
				<Checkbox label="SMS" />
				<Checkbox label="Push notifications" />
			</CheckboxGroup>
		</div>
	</div>
</template>
