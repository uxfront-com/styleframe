import type { Meta, StoryObj } from "@storybook/vue3-vite";

import RadioGroup from "@/components/components/radio/RadioGroup.vue";
import Radio from "@/components/components/radio/Radio.vue";
import RadioGroupGrid from "@/components/components/radio/preview/RadioGroupGrid.vue";

const orientations = ["vertical", "horizontal"] as const;
const sizes = ["sm", "md", "lg"] as const;

// Every group is a fieldset that its legend names, around labelled radios.
const group =
	(name: string, checked = true) =>
	(args: Record<string, unknown>) => ({
		components: { RadioGroup, Radio },
		setup() {
			return { args, name, checked };
		},
		template: `
		<RadioGroup v-bind="args">
			<Radio :name="name" :checked="checked" label="Email" />
			<Radio :name="name" label="SMS" />
			<Radio :name="name" label="Push notifications" />
		</RadioGroup>
	`,
	});

const meta = {
	title: "Theme/Recipes/Forms/Radio Group",
	component: RadioGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: orientations,
			description: "The layout direction of the group",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The gap between radios",
		},
		legend: {
			control: "text",
			description: "The question the radios answer",
		},
		hint: {
			control: "text",
			description: "A hint for the whole group",
		},
		error: {
			control: "text",
			description: "An error message, which makes the group invalid",
		},
		disabled: {
			control: "boolean",
			description: "Whether every radio in the group is disabled",
		},
	},
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: group("rg-default"),
	args: {
		orientation: "vertical",
		size: "md",
		legend: "How should we contact you?",
	},
};

export const AllOrientations: StoryObj = {
	render: () => ({
		components: { RadioGroupGrid },
		template: "<RadioGroupGrid />",
	}),
};

export const Vertical: Story = {
	render: group("rg-vertical"),
	args: {
		orientation: "vertical",
		size: "md",
		legend: "How should we contact you?",
	},
};

export const Horizontal: Story = {
	render: group("rg-horizontal"),
	args: {
		orientation: "horizontal",
		size: "md",
		legend: "How should we contact you?",
	},
};

export const WithHint: Story = {
	render: group("rg-hint"),
	args: {
		legend: "How should we contact you?",
		hint: "We'll only use it for updates about your order.",
	},
};

// The focus story's first radio is the one the harness focuses.
export const Focus: Story = {
	render: group("rg-focus"),
	args: {
		legend: "How should we contact you?",
	},
};

// An invalid group sets aria-invalid and is described by its error message.
export const Invalid: Story = {
	render: group("rg-invalid", false),
	args: {
		legend: "How should we contact you?",
		error: "Choose how we should contact you",
	},
};

export const Disabled: Story = {
	render: group("rg-disabled"),
	args: {
		legend: "How should we contact you?",
		disabled: true,
	},
};
