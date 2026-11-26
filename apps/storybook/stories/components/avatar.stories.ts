import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Avatar from "@/components/components/avatar/Avatar.vue";
import AvatarGrid from "@/components/components/avatar/preview/AvatarGrid.vue";
import AvatarSizeGrid from "@/components/components/avatar/preview/AvatarSizeGrid.vue";

const colors = ["primary", "light", "dark", "neutral"] as const;
const variants = ["solid", "soft"] as const;
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const shapes = ["circle", "square"] as const;
const statuses = ["success", "warning", "error", "neutral"] as const;
const statusPositions = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;

const meta = {
	title: "Theme/Recipes/Layout/Avatar",
	component: Avatar,
	tags: ["autodocs"],
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The fallback surface color",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The fallback fill style",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the avatar",
		},
		shape: {
			control: "select",
			options: shapes,
			description: "The shape of the avatar",
		},
		label: {
			control: "text",
			description: "Fallback initials shown when no image is set",
		},
		src: {
			control: "text",
			description: "Image URL (falls back to initials on error)",
		},
		status: {
			control: "select",
			options: [undefined, ...statuses],
			description: "Optional status badge color",
		},
		statusPosition: {
			control: "select",
			options: statusPositions,
			description: "Which corner to anchor the status badge",
		},
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "soft",
		size: "md",
		shape: "circle",
		label: "SF",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { AvatarGrid },
		template: "<AvatarGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { AvatarSizeGrid },
		template: "<AvatarSizeGrid />",
	}),
};

export const Shapes: StoryObj = {
	render: () => ({
		components: { Avatar },
		template: `
			<div class="avatar-row">
				<Avatar shape="circle" color="primary" variant="soft" size="lg" label="SF" />
				<Avatar shape="square" color="primary" variant="soft" size="lg" label="SF" />
			</div>
		`,
	}),
};

export const WithImage: Story = {
	args: {
		src: "https://i.pravatar.cc/300",
		alt: "User avatar",
		label: "SF",
		size: "lg",
	},
};

export const WithStatus: Story = {
	args: {
		label: "SF",
		size: "lg",
		status: "success",
	},
};

export const BadgePositions: StoryObj = {
	render: () => ({
		components: { Avatar },
		template: `
			<div class="avatar-row">
				<Avatar size="xl" label="TL" status="success" statusPosition="top-left" />
				<Avatar size="xl" label="TR" status="warning" statusPosition="top-right" />
				<Avatar size="xl" label="BL" status="error" statusPosition="bottom-left" />
				<Avatar size="xl" label="BR" status="neutral" statusPosition="bottom-right" />
			</div>
		`,
	}),
};

export const StatusColors: StoryObj = {
	render: () => ({
		components: { Avatar },
		template: `
			<div class="avatar-row">
				<Avatar size="lg" label="ON" status="success" />
				<Avatar size="lg" label="AW" status="warning" />
				<Avatar size="lg" label="BU" status="error" />
				<Avatar size="lg" label="OF" status="neutral" />
			</div>
		`,
	}),
};

export const Primary: Story = {
	args: { color: "primary", label: "SF" },
};

export const Light: Story = {
	args: { color: "light", label: "SF" },
};

export const Dark: Story = {
	args: { color: "dark", label: "SF" },
};

export const Neutral: Story = {
	args: { color: "neutral", label: "SF" },
};
