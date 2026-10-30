<script setup lang="ts">
import Textarea from "../Textarea.vue";

const resizes = ["none", "vertical", "horizontal", "both"] as const;
</script>

<template>
	<div class="textarea-section">
		<div v-for="resize in resizes" :key="resize" class="textarea-stack">
			<label :for="`textarea-resize-${resize}`" class="textarea-story-label">
				resize: {{ resize }}
			</label>
			<Textarea
				:id="`textarea-resize-${resize}`"
				:resize="resize"
				:rows="3"
				placeholder="A short note"
			/>
		</div>
	</div>
</template>
