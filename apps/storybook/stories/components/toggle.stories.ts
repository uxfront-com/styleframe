import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ToggleGrid from "@/components/components/toggle/preview/ToggleGrid.vue";
import ToggleSizeGrid from "@/components/components/toggle/preview/ToggleSizeGrid.vue";
import Toggle from "@/components/components/toggle/Toggle.vue";

const colors = ["light", "dark", "neutral"] as const;
const variants = ["solid", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Toggle",
	component: Toggle,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color surface of the toggle",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the toggle",
		},
		pressed: {
			control: "boolean",
			description: "Whether the toggle is on (sets aria-pressed)",
		},
		disabled: {
			control: "boolean",
			description: "Whether the toggle is disabled",
		},
		label: {
			control: "text",
			description: "The text content of the toggle",
		},
	},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Bold",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { ToggleGrid },
		template: "<ToggleGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { ToggleSizeGrid },
		template: "<ToggleSizeGrid />",
	}),
};

// Color stories
export const Light: Story = {
	args: {
		color: "light",
		label: "Light",
	},
};

export const Dark: Story = {
	args: {
		color: "dark",
		label: "Dark",
	},
};

export const Neutral: Story = {
	args: {
		color: "neutral",
		label: "Neutral",
	},
};

// Variant stories
export const Solid: Story = {
	args: {
		variant: "solid",
		label: "Solid",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		label: "Outline",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		label: "Ghost",
	},
};

// Size stories
export const Small: Story = {
	args: {
		size: "sm",
		label: "Small",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
		label: "Medium",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		label: "Large",
	},
};

// State stories
export const Pressed: Story = {
	args: {
		variant: "outline",
		pressed: true,
		label: "Pressed",
	},
};

export const Disabled: Story = {
	args: {
		variant: "outline",
		disabled: true,
		label: "Disabled",
	},
};
