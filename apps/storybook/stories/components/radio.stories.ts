import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Radio from "@/components/components/radio/Radio.vue";
import RadioGrid from "@/components/components/radio/preview/RadioGrid.vue";
import RadioSizeGrid from "@/components/components/radio/preview/RadioSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Radio",
	component: Radio,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color of the radio surface",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the radio",
		},
		checked: {
			control: "boolean",
			description: "Whether the radio is selected",
		},
		disabled: {
			control: "boolean",
			description: "Whether the radio is disabled",
		},
		label: {
			control: "text",
			description: "The radio label",
		},
	},
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		size: "md",
		checked: true,
		label: "Email notifications",
	},
};

export const AllStates: StoryObj = {
	render: () => ({
		components: { RadioGrid },
		template: "<RadioGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { RadioSizeGrid },
		template: "<RadioSizeGrid />",
	}),
};

// Colors
export const Neutral: Story = {
	args: { color: "neutral", label: "Neutral" },
};

export const Light: Story = {
	args: { color: "light", label: "Light" },
};

export const Dark: Story = {
	args: { color: "dark", label: "Dark" },
};

// States
export const Unchecked: Story = {
	args: { checked: false, label: "Unselected" },
};

export const Checked: Story = {
	args: { checked: true, label: "Selected" },
};

export const Disabled: Story = {
	args: { disabled: true, label: "Disabled" },
};

export const DisabledChecked: Story = {
	args: { disabled: true, checked: true, label: "Disabled selected" },
};

// The focus story's radio is the one the harness focuses.
export const Focus: Story = {
	args: { checked: true, label: "Email notifications" },
};

// Sizes
export const Small: Story = {
	args: { size: "sm", checked: true, label: "Small" },
};

export const Medium: Story = {
	args: { size: "md", checked: true, label: "Medium" },
};

export const Large: Story = {
	args: { size: "lg", checked: true, label: "Large" },
};
