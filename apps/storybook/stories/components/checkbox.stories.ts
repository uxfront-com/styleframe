import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Checkbox from "@/components/components/checkbox/Checkbox.vue";
import CheckboxGrid from "@/components/components/checkbox/preview/CheckboxGrid.vue";
import CheckboxSizeGrid from "@/components/components/checkbox/preview/CheckboxSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color of the checkbox surface",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the checkbox",
		},
		checked: {
			control: "boolean",
			description: "Whether the checkbox is checked",
		},
		indeterminate: {
			control: "boolean",
			description: "Whether the checkbox is in an indeterminate state",
		},
		disabled: {
			control: "boolean",
			description: "Whether the checkbox is disabled",
		},
		readonly: {
			control: "boolean",
			description:
				"Whether the checkbox is read-only (sets aria-readonly and cancels toggling)",
		},
		invalid: {
			control: "boolean",
			description: "Whether the checkbox is invalid (sets aria-invalid)",
		},
		label: {
			control: "text",
			description: "The checkbox label",
		},
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		size: "md",
		checked: true,
		label: "Accept terms and conditions",
	},
};

export const AllStates: StoryObj = {
	render: () => ({
		components: { CheckboxGrid },
		template: "<CheckboxGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { CheckboxSizeGrid },
		template: "<CheckboxSizeGrid />",
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
	args: { checked: false, label: "Unchecked" },
};

export const Checked: Story = {
	args: { checked: true, label: "Checked" },
};

export const Indeterminate: Story = {
	args: { indeterminate: true, label: "Indeterminate" },
};

export const Disabled: Story = {
	args: { disabled: true, label: "Disabled" },
};

export const DisabledChecked: Story = {
	args: { disabled: true, checked: true, label: "Disabled checked" },
};

export const ReadOnly: Story = {
	args: { readonly: true, label: "Read-only" },
};

export const ReadOnlyChecked: Story = {
	args: { readonly: true, checked: true, label: "Read-only checked" },
};

export const Invalid: Story = {
	args: { invalid: true, label: "I agree to the terms" },
};

export const InvalidChecked: Story = {
	args: { invalid: true, checked: true, label: "Invalid checked" },
};

// One checkbox for the keyboard focus ring: Tab moves focus to it.
export const Focus: Story = {
	args: { label: "Focus me with Tab" },
};

// A label longer than its column wraps beside the box, which stays by its first line.
export const LongLabel: StoryObj = {
	render: () => ({
		components: { Checkbox },
		template: `<div class="checkbox-narrow"><Checkbox checked label="Email me product updates, tips and the occasional survey about how we can improve" /></div>`,
	}),
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
