import type { Meta, StoryObj } from "@storybook/vue3-vite";

import CheckboxGroup from "@/components/components/checkbox/CheckboxGroup.vue";
import Checkbox from "@/components/components/checkbox/Checkbox.vue";
import CheckboxGroupGrid from "@/components/components/checkbox/preview/CheckboxGroupGrid.vue";

const orientations = ["vertical", "horizontal"] as const;
const sizes = ["sm", "md", "lg"] as const;

// Every group is a fieldset that its legend names, around labelled checkboxes.
// An invalid group's options are invalid too, so each one reads invalid.
const group =
	(invalid = false) =>
	(args: Record<string, unknown>) => ({
		components: { CheckboxGroup, Checkbox },
		setup() {
			return { args, invalid };
		},
		template: `
		<CheckboxGroup v-bind="args">
			<Checkbox :size="args.size" :checked="!invalid" :invalid="invalid" label="Email" />
			<Checkbox :size="args.size" :invalid="invalid" label="SMS" />
			<Checkbox :size="args.size" :invalid="invalid" label="Push notifications" />
		</CheckboxGroup>
	`,
	});

const meta = {
	title: "Theme/Recipes/Forms/Checkbox Group",
	component: CheckboxGroup,
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
			description:
				"The gap between checkboxes, the legend's size and the select-all indent",
		},
		legend: {
			control: "text",
			description: "The question the checkboxes answer",
		},
		error: {
			control: "text",
			description: "An error message, which makes the group invalid",
		},
		disabled: {
			control: "boolean",
			description: "Whether every checkbox in the group is disabled",
		},
	},
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: group(),
	args: {
		orientation: "vertical",
		size: "md",
		legend: "Which notifications would you like?",
	},
};

export const AllOrientations: StoryObj = {
	render: () => ({
		components: { CheckboxGroupGrid },
		template: "<CheckboxGroupGrid />",
	}),
};

export const Vertical: Story = {
	render: group(),
	args: {
		orientation: "vertical",
		size: "md",
		legend: "Which notifications would you like?",
	},
};

export const Horizontal: Story = {
	render: group(),
	args: {
		orientation: "horizontal",
		size: "md",
		legend: "Which notifications would you like?",
	},
};

// The options sit in from the select-all box, so their boxes line up with its
// label. It's mixed while only some of them are checked.
export const SelectAll: Story = {
	render: (args) => ({
		components: { CheckboxGroup, Checkbox },
		setup() {
			return { args };
		},
		template: `
		<CheckboxGroup v-bind="args">
			<div data-slot="select-all">
				<Checkbox :size="args.size" indeterminate label="All notifications" />
			</div>
			<div data-slot="options">
				<Checkbox :size="args.size" checked label="Email" />
				<Checkbox :size="args.size" label="SMS" />
				<Checkbox :size="args.size" label="Push notifications" />
			</div>
		</CheckboxGroup>
	`,
	}),
	args: {
		orientation: "vertical",
		size: "md",
		legend: "Which notifications would you like?",
	},
};

// The focus story's first checkbox is the one the harness focuses.
export const Focus: Story = {
	render: group(),
	args: {
		legend: "Which notifications would you like?",
	},
};

// An invalid group sets aria-invalid and is described by its error message.
export const Invalid: Story = {
	render: group(true),
	args: {
		legend: "Which notifications would you like?",
		error: "Pick at least one way to hear from us",
	},
};

export const Disabled: Story = {
	render: group(),
	args: {
		legend: "Which notifications would you like?",
		disabled: true,
	},
};
