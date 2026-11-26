<script setup lang="ts">
import ChatMessage from "../ChatMessage.vue";
import ChatMessageAvatar from "../ChatMessageAvatar.vue";
import ChatMessageContent from "../ChatMessageContent.vue";
import ChatMessageActions from "../ChatMessageActions.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="chat-message-section">
		<div v-for="size in sizes" :key="size">
			<div class="chat-message-label">{{ sizeTitles[size] }}</div>
			<div class="chat-message-row">
				<ChatMessage :size="size" side="start">
					<ChatMessageAvatar :size="size">AI</ChatMessageAvatar>
					<div class="chat-message-stack">
						<ChatMessageContent :size="size">
							This is a {{ sizeTitles[size].toLowerCase() }} assistant message.
						</ChatMessageContent>
						<ChatMessageActions :size="size">
							<button class="chat-message-action-button" type="button">Copy</button>
							<button class="chat-message-action-button" type="button">Regenerate</button>
						</ChatMessageActions>
					</div>
				</ChatMessage>
				<ChatMessage :size="size" side="end">
					<ChatMessageAvatar :size="size">Me</ChatMessageAvatar>
					<ChatMessageContent :size="size">
						And this is a {{ sizeTitles[size].toLowerCase() }} user reply.
					</ChatMessageContent>
				</ChatMessage>
			</div>
		</div>
	</div>
</template>
