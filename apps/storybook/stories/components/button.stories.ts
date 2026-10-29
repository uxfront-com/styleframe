import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Button from "../../src/components/components/button/Button.vue";
import ButtonGrid from "../../src/components/components/button/preview/ButtonGrid.vue";
import ButtonSizeGrid from "../../src/components/components/button/preview/ButtonSizeGrid.vue";

const colors = [
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"light",
	"dark",
	"neutral",
] as const;
const variants = [
	"solid",
	"outline",
	"soft",
	"subtle",
	"ghost",
	"link",
] as const;
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
	title: "Theme/Recipes/Actions/Button",
	component: Button,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the button",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the button",
		},
		label: {
			control: "text",
			description: "The text content of the button",
		},
		disabled: {
			control: "boolean",
			description: "Whether the button is disabled",
		},
		pressed: {
			control: "boolean",
			description: "Whether a toggle button is pressed (aria-pressed)",
		},
		loading: {
			control: "boolean",
			description:
				"Whether the button is loading (data-loading, with aria-disabled)",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Button",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { ButtonGrid },
		template: "<ButtonGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { ButtonSizeGrid },
		template: "<ButtonSizeGrid />",
	}),
};

// Individual color stories
export const Primary: Story = {
	args: {
		color: "primary",
		label: "Primary",
	},
};

export const Secondary: Story = {
	args: {
		color: "secondary",
		label: "Secondary",
	},
};

export const Success: Story = {
	args: {
		color: "success",
		label: "Success",
	},
};

export const Info: Story = {
	args: {
		color: "info",
		label: "Info",
	},
};

export const Warning: Story = {
	args: {
		color: "warning",
		label: "Warning",
	},
};

export const Error: Story = {
	args: {
		color: "error",
		label: "Error",
	},
};

export const Light: Story = {
	args: {
		color: "light",
		label: "Light",
	},
	decorators: [
		() => ({ template: '<span class="button-surface-dark"><story /></span>' }),
	],
};

export const Dark: Story = {
	args: {
		color: "dark",
		label: "Dark",
	},
	decorators: [
		() => ({
			template: '<span class="button-surface-light"><story /></span>',
		}),
	],
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

export const Soft: Story = {
	args: {
		variant: "soft",
		label: "Soft",
	},
};

export const Subtle: Story = {
	args: {
		variant: "subtle",
		label: "Subtle",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		label: "Ghost",
	},
};

export const Link: Story = {
	args: {
		variant: "link",
		label: "Link",
	},
};

// Size stories
export const ExtraSmall: Story = {
	args: {
		size: "xs",
		label: "Extra Small",
	},
};

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

export const ExtraLarge: Story = {
	args: {
		size: "xl",
		label: "Extra Large",
	},
};

// Disabled story
export const Disabled: Story = {
	args: {
		label: "Disabled",
		disabled: true,
	},
};

// State stories
export const Focus: Story = {
	args: {
		label: "Focus me",
	},
};

export const Pressed: Story = {
	args: {
		label: "Pressed",
		pressed: true,
	},
};

export const Loading: Story = {
	args: {
		label: "Loading",
		loading: true,
	},
};
