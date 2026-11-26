<script setup lang="ts">
import AvatarGroup from "../AvatarGroup.vue";
import Avatar from "../Avatar.vue";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
</script>

<template>
	<div class="avatar-section">
		<div v-for="size in sizes" :key="size">
			<div class="avatar-label">{{ size }}</div>
			<AvatarGroup :size="size" :count="3">
				<Avatar :size="size" src="https://i.pravatar.cc/120?img=11" alt="Team member" label="AB" />
				<Avatar :size="size" src="https://i.pravatar.cc/120?img=12" alt="Team member" label="CD" />
				<Avatar :size="size" src="https://i.pravatar.cc/120?img=13" alt="Team member" label="EF" />
			</AvatarGroup>
		</div>
	</div>
</template>
