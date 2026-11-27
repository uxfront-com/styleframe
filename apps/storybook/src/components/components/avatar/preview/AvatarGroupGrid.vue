<script setup lang="ts">
import AvatarGroup from "../AvatarGroup.vue";
import Avatar from "../Avatar.vue";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

// Bound, not static attributes: vue-tsc 3.3.14 reads the `//` of a static URL
// on a component as a comment, then loses the `v-for` variable after it.
const photo = (img: number) => `https://i.pravatar.cc/120?img=${img}`;
</script>

<template>
	<div class="avatar-section">
		<div v-for="size in sizes" :key="size">
			<div class="avatar-label">{{ size }}</div>
			<AvatarGroup :size="size" :count="3">
				<Avatar :size="size" :src="photo(11)" alt="Team member" label="AB" />
				<Avatar :size="size" :src="photo(12)" alt="Team member" label="CD" />
				<Avatar :size="size" :src="photo(13)" alt="Team member" label="EF" />
			</AvatarGroup>
		</div>
	</div>
</template>
