<script setup lang="ts">
import Media from "../Media.vue";
import MediaFigure from "../MediaFigure.vue";
import MediaBody from "../MediaBody.vue";
import MediaTitle from "../MediaTitle.vue";

const orientations = ["horizontal", "vertical"] as const;
const aligns = ["start", "center", "end"] as const;
</script>

<template>
	<div class="media-section">
		<div v-for="orientation in orientations" :key="orientation">
			<div class="media-label">{{ orientation }}</div>
			<div class="media-row">
				<Media
					v-for="align in aligns"
					:key="`${orientation}-${align}`"
					:orientation="orientation"
					:align="align"
					class="_max-width:[320px]"
				>
					<MediaFigure>
						<div class="media-avatar _width:[40px] _height:[40px]">MA</div>
					</MediaFigure>
					<MediaBody>
						<MediaTitle>{{ align.charAt(0).toUpperCase() + align.slice(1) }} aligned</MediaTitle>
						<p class="_margin:0">
							A short body paragraph that follows the title in the media body.
						</p>
					</MediaBody>
				</Media>
			</div>
		</div>
	</div>
</template>
