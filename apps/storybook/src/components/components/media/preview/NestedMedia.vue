<script setup lang="ts">
import Media from "../Media.vue";
import MediaFigure from "../MediaFigure.vue";
import MediaBody from "../MediaBody.vue";
import MediaTitle from "../MediaTitle.vue";
</script>

<template>
	<div class="media-section">
		<Media class="_max-width:[480px]">
			<MediaFigure>
				<div class="media-avatar _width:[40px] _height:[40px]">AG</div>
			</MediaFigure>
			<MediaBody>
				<MediaTitle>Alex Grozav</MediaTitle>
				<p class="_margin:0">
					Just shipped the new Media recipe — perfect for nested comment threads and social-feed
					layouts.
				</p>

				<Media class="_margin-top:0.75">
					<MediaFigure size="sm">
						<div class="media-avatar _width:[32px] _height:[32px]">JS</div>
					</MediaFigure>
					<MediaBody size="sm">
						<MediaTitle size="sm">Jane Smith</MediaTitle>
						<p class="_margin:0">
							Love it — the layout-only design means I can drop it inside any Card without
							conflicts.
						</p>

						<Media class="_margin-top:0.75">
							<MediaFigure size="sm">
								<div class="media-avatar _width:[32px] _height:[32px]">AG</div>
							</MediaFigure>
							<MediaBody size="sm">
								<MediaTitle size="sm">Alex Grozav</MediaTitle>
								<p class="_margin:0">
									Exactly the design intent — compose freely, no surface opinions baked in.
								</p>
							</MediaBody>
						</Media>
					</MediaBody>
				</Media>
			</MediaBody>
		</Media>
	</div>
</template>
