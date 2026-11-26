import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Button from "../../src/components/components/button/Button.vue";
import FieldGroup from "../../src/components/components/field-group/FieldGroup.vue";
import Input from "../../src/components/components/input/Input.vue";
import Select from "../../src/components/components/select/Select.vue";

const orientations = ["horizontal", "vertical"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Field Group",
	component: FieldGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: orientations,
			description: "The orientation of the field group",
		},
		block: {
			control: "boolean",
			description: "Whether the group takes full width",
		},
	},
} satisfies Meta<typeof FieldGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => ({
		components: { FieldGroup, Button, Input },
		setup() {
			return { args };
		},
		template: `
			<FieldGroup v-bind="args">
				<Button color="neutral" variant="outline" label="https://" />
				<Input placeholder="example.com" />
				<Button color="primary" label="Go" />
			</FieldGroup>
		`,
	}),
};

export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => ({
		components: { FieldGroup, Button, Input },
		setup() {
			return { args };
		},
		template: `
			<FieldGroup v-bind="args">
				<Input placeholder="Search..." />
				<Button color="primary" label="Search" />
			</FieldGroup>
		`,
	}),
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
	render: (args) => ({
		components: { FieldGroup, Button },
		setup() {
			return { args };
		},
		template: `
			<FieldGroup v-bind="args">
				<Button label="Top" />
				<Button label="Middle" />
				<Button label="Bottom" />
			</FieldGroup>
		`,
	}),
};

export const Block: Story = {
	args: {
		orientation: "horizontal",
		block: true,
	},
	render: (args) => ({
		components: { FieldGroup, Button, Input },
		setup() {
			return { args };
		},
		template: `
			<FieldGroup v-bind="args">
				<Input placeholder="Subscribe with your email" />
				<Button color="primary" label="Subscribe" />
			</FieldGroup>
		`,
	}),
};

export const WithSelect: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => ({
		components: { FieldGroup, Input, Select },
		setup() {
			return { args };
		},
		template: `
			<FieldGroup v-bind="args">
				<Select placeholder="USD" />
				<Input placeholder="0.00" />
			</FieldGroup>
		`,
	}),
};
