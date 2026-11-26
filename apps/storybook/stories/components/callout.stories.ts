import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Button from "../../src/components/components/button/Button.vue";
import Callout from "../../src/components/components/callout/Callout.vue";
import CalloutGrid from "../../src/components/components/callout/preview/CalloutGrid.vue";
import CalloutOrientationGrid from "../../src/components/components/callout/preview/CalloutOrientationGrid.vue";
import CalloutSizeGrid from "../../src/components/components/callout/preview/CalloutSizeGrid.vue";

const colors = [
	"neutral",
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"light",
	"dark",
] as const;
const variants = ["solid", "outline", "soft", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;
const orientations = ["horizontal", "vertical"] as const;

const meta = {
	title: "Theme/Recipes/Feedback/Callout",
	component: Callout,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the callout",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the callout",
		},
		orientation: {
			control: "select",
			options: orientations,
			description: "The layout direction of the callout",
		},
		title: {
			control: "text",
			description: "The title text of the callout",
		},
		description: {
			control: "text",
			description: "The description text of the callout",
		},
		icon: {
			control: "text",
			description: "The name of the icon to display (optional)",
		},
		dismissible: {
			control: "boolean",
			description: "Whether the callout can be dismissed",
		},
	},
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "subtle",
		size: "md",
		orientation: "horizontal",
		title: "Callout",
		description: "This is a callout description.",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { CalloutGrid },
		template: "<CalloutGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { CalloutSizeGrid },
		template: "<CalloutSizeGrid />",
	}),
};

export const AllOrientations: StoryObj = {
	render: () => ({
		components: { CalloutOrientationGrid },
		template: "<CalloutOrientationGrid />",
	}),
};

export const Dismissible: Story = {
	args: {
		color: "info",
		dismissible: true,
		title: "Dismissible Callout",
		description: "Click the dismiss button to hide this callout.",
	},
	render: (args) => ({
		components: { Callout, Button },
		setup() {
			const dismissed = ref(false);
			return { args, dismissed };
		},
		template: `
			<Callout v-bind="args" :hidden="dismissed" @dismiss="dismissed = true" />
			<Button v-if="dismissed" label="Reset" @click="dismissed = false" />
		`,
	}),
};

// Individual color stories
export const Neutral: Story = {
	args: {
		color: "neutral",
		title: "Neutral Callout",
		description: "This is a neutral callout.",
	},
};

export const Primary: Story = {
	args: {
		color: "primary",
		title: "Primary Callout",
		description: "This is a primary callout.",
	},
};

export const Secondary: Story = {
	args: {
		color: "secondary",
		title: "Secondary Callout",
		description: "This is a secondary callout.",
	},
};

export const Success: Story = {
	args: {
		color: "success",
		title: "Success Callout",
		description: "This is a success callout.",
	},
};

export const Info: Story = {
	args: {
		color: "info",
		title: "Info Callout",
		description: "This is an info callout.",
	},
};

export const Warning: Story = {
	args: {
		color: "warning",
		title: "Warning Callout",
		description: "This is a warning callout.",
	},
};

export const Error: Story = {
	args: {
		color: "error",
		title: "Error Callout",
		description: "This is an error callout.",
	},
};

export const Light: Story = {
	args: {
		color: "light",
		title: "Light Callout",
		description: "This is a light callout.",
	},
};

export const Dark: Story = {
	args: {
		color: "dark",
		title: "Dark Callout",
		description: "This is a dark callout.",
	},
};

// Variant stories
export const Solid: Story = {
	args: {
		variant: "solid",
		title: "Solid Callout",
		description: "This is a solid callout.",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		title: "Outline Callout",
		description: "This is an outline callout.",
	},
};

export const Soft: Story = {
	args: {
		variant: "soft",
		title: "Soft Callout",
		description: "This is a soft callout.",
	},
};

export const Subtle: Story = {
	args: {
		variant: "subtle",
		title: "Subtle Callout",
		description: "This is a subtle callout.",
	},
};

// Size stories
export const Small: Story = {
	args: {
		size: "sm",
		title: "Small Callout",
		description: "This is a small callout.",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
		title: "Medium Callout",
		description: "This is a medium callout.",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		title: "Large Callout",
		description: "This is a large callout.",
	},
};

// Orientation stories
export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
		title: "Horizontal Callout",
		description: "This callout is oriented horizontally.",
	},
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
		title: "Vertical Callout",
		description: "This callout is oriented vertically.",
	},
};
