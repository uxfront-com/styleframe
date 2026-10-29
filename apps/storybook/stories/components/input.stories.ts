import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Button from "@/components/components/button/Button.vue";
import Input from "@/components/components/input/Input.vue";
import FieldGroup from "@/components/components/field-group/FieldGroup.vue";
import InputGrid from "@/components/components/input/preview/InputGrid.vue";
import InputSizeGrid from "@/components/components/input/preview/InputSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["default", "soft", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

// Every example has a visible <label>, linked to the native input by an id
// made from the story's own, so the ids stay unique on the docs page too.
const labelled =
	(label: string) =>
	(args: Record<string, unknown>, { id }: { id: string }) => ({
		components: { Input },
		setup() {
			return { args, label, id };
		},
		template: `
		<div class="input-stack">
			<label :for="id" class="input-story-label">{{ label }}</label>
			<Input :id="id" v-bind="args" />
		</div>
	`,
	});

const meta = {
	title: "Theme/Recipes/Forms/Input",
	component: Input,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	render: labelled("Full name"),
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the input",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the input",
		},
		invalid: {
			control: "boolean",
			description: "Whether the input is in an invalid state",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
		disabled: {
			control: "boolean",
			description: "Whether the input is disabled",
		},
		readonly: {
			control: "boolean",
			description: "Whether the input is read-only",
		},
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "default",
		size: "md",
		invalid: false,
		placeholder: "Enter text...",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { InputGrid },
		template: "<InputGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { InputSizeGrid },
		template: "<InputSizeGrid />",
	}),
};

// Individual color stories
export const Neutral: Story = {
	args: {
		color: "neutral",
		placeholder: "Neutral input",
	},
};

export const Light: Story = {
	args: {
		color: "light",
		placeholder: "Light input",
	},
};

export const Dark: Story = {
	args: {
		color: "dark",
		placeholder: "Dark input",
	},
};

// Variant stories
export const DefaultVariant: Story = {
	args: {
		variant: "default",
		placeholder: "Default variant",
	},
};

export const Soft: Story = {
	args: {
		variant: "soft",
		placeholder: "Soft variant",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		placeholder: "Ghost variant",
	},
};

// Size stories
export const Small: Story = {
	args: {
		size: "sm",
		placeholder: "Small input",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
		placeholder: "Medium input",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		placeholder: "Large input",
	},
};

// State stories
export const Focus: Story = {
	args: {
		placeholder: "Ada Lovelace",
	},
};

// An invalid input sets aria-invalid and points to its error message.
export const Invalid: Story = {
	render: (args, { id }) => ({
		components: { Input },
		setup() {
			return { args, id };
		},
		template: `
			<div class="input-stack">
				<label :for="id" class="input-story-label">Email address</label>
				<Input :id="id" :describedby="id + '-error'" v-bind="args" />
				<p :id="id + '-error'" class="input-story-message">
					Enter an email address, like name@example.com
				</p>
			</div>
		`,
	}),
	args: {
		invalid: true,
		modelValue: "ada@",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		modelValue: "Ada Lovelace",
	},
};

export const ReadOnly: Story = {
	args: {
		readonly: true,
		modelValue: "Ada Lovelace",
	},
};

// Inline addon stories — demonstrate prefix/suffix INSIDE the input wrapper
export const WithPrefix: StoryObj = {
	render: (args, { id }) => ({
		components: { Input },
		setup() {
			return { args, id };
		},
		template: `
			<div class="input-stack">
				<label :for="id" class="input-story-label">Price, in US dollars</label>
				<Input :id="id" v-bind="args" placeholder="0.00">
					<template #prefix>$</template>
				</Input>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};

export const WithSuffix: StoryObj = {
	render: (args, { id }) => ({
		components: { Input },
		setup() {
			return { args, id };
		},
		template: `
			<div class="input-stack">
				<label :for="id" class="input-story-label">Search, or press ⌘K</label>
				<Input :id="id" v-bind="args" placeholder="search...">
					<template #suffix>⌘K</template>
				</Input>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};

export const WithPrefixAndSuffix: StoryObj = {
	render: (args, { id }) => ({
		components: { Input },
		setup() {
			return { args, id };
		},
		template: `
			<div class="input-stack">
				<label :for="id" class="input-story-label">Price, in whole US dollars</label>
				<Input :id="id" v-bind="args" placeholder="0">
					<template #prefix>$</template>
					<template #suffix>.00</template>
				</Input>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};

// Attached controls — group the input with buttons (or any bordered control)
// as direct children of a FieldGroup; the seams merge into one unit.
export const WithFieldGroup: StoryObj = {
	render: (args, { id }) => ({
		components: { Button, Input, FieldGroup },
		setup() {
			return { args, id };
		},
		template: `
			<div class="input-stack">
				<label :for="id" class="input-story-label">Amount, in US dollars</label>
				<FieldGroup>
					<Button color="neutral" variant="outline" :size="args.size" label="USD" />
					<Input :id="id" v-bind="args" placeholder="0.00" />
					<Button color="primary" variant="solid" :size="args.size" label="Submit" />
				</FieldGroup>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};
