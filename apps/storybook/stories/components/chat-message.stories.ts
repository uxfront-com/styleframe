import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ChatMessage from "@/components/components/chat-message/ChatMessage.vue";
import ChatMessageActions from "@/components/components/chat-message/ChatMessageActions.vue";
import ChatMessageAvatar from "@/components/components/chat-message/ChatMessageAvatar.vue";
import ChatMessageContent from "@/components/components/chat-message/ChatMessageContent.vue";
import ChatMessageGrid from "@/components/components/chat-message/preview/ChatMessageGrid.vue";
import ChatMessageSizeGrid from "@/components/components/chat-message/preview/ChatMessageSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "outline", "soft", "subtle", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;
const sides = ["start", "end"] as const;

const meta = {
	title: "Theme/Recipes/AI Chat/ChatMessage",
	component: ChatMessage,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the message",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the message",
		},
		side: {
			control: "select",
			options: sides,
			description: "Logical side: start (assistant) or end (user)",
		},
	},
	render: (args) => ({
		components: {
			ChatMessage,
			ChatMessageAvatar,
			ChatMessageContent,
			ChatMessageActions,
		},
		setup() {
			return { args };
		},
		template: `
			<ChatMessage v-bind="args">
				<ChatMessageAvatar v-bind="args">AI</ChatMessageAvatar>
				<div class="chat-message-stack">
					<ChatMessageContent v-bind="args">
						Hello! I'm an assistant message rendered with the chat-message recipe.
					</ChatMessageContent>
					<ChatMessageActions v-bind="args">
						<button class="chat-message-action-button" type="button">Copy</button>
						<button class="chat-message-action-button" type="button">Regenerate</button>
					</ChatMessageActions>
				</div>
			</ChatMessage>
		`,
	}),
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "subtle",
		size: "md",
		side: "start",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { ChatMessageGrid },
		template: "<ChatMessageGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { ChatMessageSizeGrid },
		template: "<ChatMessageSizeGrid />",
	}),
};

// Color stories
export const Neutral: Story = {
	args: { color: "neutral" },
};

export const Light: Story = {
	args: { color: "light" },
};

export const Dark: Story = {
	args: { color: "dark" },
};

// Variant stories
export const Solid: Story = {
	args: { variant: "solid" },
};

export const Outline: Story = {
	args: { variant: "outline" },
};

export const Soft: Story = {
	args: { variant: "soft" },
};

export const Subtle: Story = {
	args: { variant: "subtle" },
};

export const Ghost: Story = {
	args: { variant: "ghost" },
};

// Size stories
export const Small: Story = {
	args: { size: "sm" },
};

export const Medium: Story = {
	args: { size: "md" },
};

export const Large: Story = {
	args: { size: "lg" },
};

// Side stories
export const SideStart: Story = {
	args: { side: "start" },
};

export const SideEnd: Story = {
	args: { side: "end" },
};
