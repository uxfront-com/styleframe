<script setup lang="ts">
import Media from "../Media.vue";
import MediaFigure from "../MediaFigure.vue";
import MediaBody from "../MediaBody.vue";
import MediaTitle from "../MediaTitle.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
const sizeAvatarClass: Record<string, string> = {
	sm: "_width:[32px] _height:[32px]",
	md: "_width:[40px] _height:[40px]",
	lg: "_width:[48px] _height:[48px]",
};
</script>

<template>
	<div class="media-section">
		<div v-for="size in sizes" :key="size">
			<div class="media-label">{{ size }}</div>
			<div class="media-row">
				<Media :size="size" class="_max-width:[360px]">
					<MediaFigure :size="size">
						<div :class="['media-avatar', sizeAvatarClass[size]]">
							{{ sizeTitles[size]?.charAt(0) }}
						</div>
					</MediaFigure>
					<MediaBody :size="size">
						<MediaTitle :size="size">{{ sizeTitles[size] }} media</MediaTitle>
						<p class="_margin:0">A {{ size }} media object with figure, body, and title.</p>
					</MediaBody>
				</Media>
			</div>
		</div>
	</div>
</template>
