import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Switch from "@/components/components/switch/Switch.vue";
import SwitchGrid from "@/components/components/switch/preview/SwitchGrid.vue";
import SwitchSizeGrid from "@/components/components/switch/preview/SwitchSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Switch",
	component: Switch,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color of the switch track surface",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the switch",
		},
		checked: {
			control: "boolean",
			description: "Whether the switch is on",
		},
		disabled: {
			control: "boolean",
			description: "Whether the switch is disabled",
		},
		readonly: {
			control: "boolean",
			description: "Whether the switch can be focused but not flipped",
		},
		invalid: {
			control: "boolean",
			description: "Whether the switch sets aria-invalid",
		},
		label: {
			control: "text",
			description: "The switch label",
		},
	},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		size: "md",
		checked: true,
		label: "Enable notifications",
	},
};

export const AllStates: StoryObj = {
	render: () => ({
		components: { SwitchGrid },
		template: "<SwitchGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { SwitchSizeGrid },
		template: "<SwitchSizeGrid />",
	}),
};

// Colors
export const Neutral: Story = {
	args: { color: "neutral", checked: true, label: "Neutral" },
};

export const Light: Story = {
	args: { color: "light", checked: true, label: "Light" },
};

export const Dark: Story = {
	args: { color: "dark", checked: true, label: "Dark" },
};

// States
export const Unchecked: Story = {
	args: { checked: false, label: "Off" },
};

export const Checked: Story = {
	args: { checked: true, label: "On" },
};

export const Disabled: Story = {
	args: { disabled: true, label: "Disabled" },
};

export const DisabledChecked: Story = {
	args: { disabled: true, checked: true, label: "Disabled on" },
};

export const ReadOnly: Story = {
	args: { readonly: true, label: "Single sign-on" },
};

export const ReadOnlyChecked: Story = {
	args: { readonly: true, checked: true, label: "Single sign-on" },
};

// An invalid switch sets aria-invalid and points to its error message.
export const Invalid: Story = {
	render: (args) => ({
		components: { Switch },
		setup() {
			return { args };
		},
		template: `
			<div class="switch-stack">
				<Switch describedby="switch-story-error" v-bind="args" />
				<p id="switch-story-error" class="switch-story-message">
					Couldn't turn on price alerts. Try again.
				</p>
			</div>
		`,
	}),
	args: { invalid: true, label: "Price alerts" },
};

// The harness focuses the switch to show its focus ring.
export const Focus: Story = {
	args: { label: "Wi-Fi" },
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
