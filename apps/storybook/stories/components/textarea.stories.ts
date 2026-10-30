import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Button from "@/components/components/button/Button.vue";
import Textarea from "@/components/components/textarea/Textarea.vue";
import FieldGroup from "@/components/components/field-group/FieldGroup.vue";
import TextareaGrid from "@/components/components/textarea/preview/TextareaGrid.vue";
import TextareaSizeGrid from "@/components/components/textarea/preview/TextareaSizeGrid.vue";
import TextareaResizeGrid from "@/components/components/textarea/preview/TextareaResizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["default", "soft", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;
const resizes = ["none", "vertical", "horizontal", "both"] as const;

// Every example has a visible <label>, linked to the native textarea by an id
// made from the story's own. The docs page renders the primary story twice,
// so its id appears on two textareas there.
const labelled =
	(label: string) =>
	(args: Record<string, unknown>, { id }: { id: string }) => ({
		components: { Textarea },
		setup() {
			return { args, label, id };
		},
		template: `
		<div class="textarea-stack">
			<label :for="id" class="textarea-story-label">{{ label }}</label>
			<Textarea :id="id" v-bind="args" />
		</div>
	`,
	});

const meta = {
	title: "Theme/Recipes/Forms/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	render: labelled("Message"),
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the textarea",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the textarea",
		},
		resize: {
			control: "select",
			options: resizes,
			description: "The resize behavior of the nested textarea",
		},
		autogrow: {
			control: "boolean",
			description: "Whether the textarea grows with its text",
		},
		maxRows: {
			control: "number",
			description: "The rows an auto-growing textarea stops at",
		},
		rows: {
			control: "number",
			description: "Number of visible text rows",
		},
		invalid: {
			control: "boolean",
			description: "Whether the textarea is in an invalid state",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
		disabled: {
			control: "boolean",
			description: "Whether the textarea is disabled",
		},
		readonly: {
			control: "boolean",
			description: "Whether the textarea is read-only",
		},
	},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "default",
		size: "md",
		resize: "vertical",
		invalid: false,
		rows: 4,
		placeholder: "Enter text...",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { TextareaGrid },
		template: "<TextareaGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { TextareaSizeGrid },
		template: "<TextareaSizeGrid />",
	}),
};

export const AllResize: StoryObj = {
	render: () => ({
		components: { TextareaResizeGrid },
		template: "<TextareaResizeGrid />",
	}),
};

// Individual color stories
export const Neutral: Story = {
	args: {
		color: "neutral",
		placeholder: "Neutral textarea",
	},
};

export const Light: Story = {
	args: {
		color: "light",
		placeholder: "Light textarea",
	},
};

export const Dark: Story = {
	args: {
		color: "dark",
		placeholder: "Dark textarea",
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
		placeholder: "Small textarea",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
		placeholder: "Medium textarea",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		placeholder: "Large textarea",
	},
};

// State stories
export const Focus: Story = {
	args: {
		placeholder: "What went well?",
	},
};

// An invalid textarea sets aria-invalid and points to its error message.
export const Invalid: Story = {
	render: (args, { id }) => ({
		components: { Textarea },
		setup() {
			return { args, id };
		},
		template: `
			<div class="textarea-stack">
				<label :for="id" class="textarea-story-label">Feedback</label>
				<Textarea :id="id" :describedby="id + '-error'" v-bind="args" />
				<p :id="id + '-error'" class="textarea-story-message">
					Tell us what happened, in a few words
				</p>
			</div>
		`,
	}),
	args: {
		invalid: true,
		rows: 3,
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		modelValue: "Thanks for the quick reply.",
	},
};

export const ReadOnly: Story = {
	args: {
		readonly: true,
		modelValue: "Thanks for the quick reply.",
	},
};

// Grows with its text from 2 rows up to 6, then scrolls.
export const AutoGrow: Story = {
	args: {
		autogrow: true,
		rows: 2,
		maxRows: 6,
		modelValue:
			"Thanks for the quick reply.\nThe parcel arrived on Monday.\nOne of the cups was cracked.\nCould you send a new one?\nThe order number is on the box.\nI can send a photo too.\nThanks again.",
	},
};

// Inline addon stories — demonstrate prefix/suffix INSIDE the textarea wrapper.
// With the wrapper top-aligned, addons anchor to the top of the field.
export const WithPrefix: StoryObj = {
	render: (args, { id }) => ({
		components: { Textarea },
		setup() {
			return { args, id };
		},
		template: `
			<div class="textarea-stack">
				<label :for="id" class="textarea-story-label">Note</label>
				<Textarea :id="id" v-bind="args" placeholder="Write a note...">
					<template #prefix>✎</template>
				</Textarea>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};

export const WithSuffix: StoryObj = {
	render: (args, { id }) => ({
		components: { Textarea },
		setup() {
			return { args, id };
		},
		template: `
			<div class="textarea-stack">
				<label :for="id" class="textarea-story-label">Feedback, up to 280 characters</label>
				<Textarea :id="id" :describedby="id + '-count'" v-bind="args" placeholder="Share your feedback...">
					<template #suffix><span :id="id + '-count'">280 left</span></template>
				</Textarea>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};

export const WithPrefixAndSuffix: StoryObj = {
	render: (args, { id }) => ({
		components: { Textarea },
		setup() {
			return { args, id };
		},
		template: `
			<div class="textarea-stack">
				<label :for="id" class="textarea-story-label">Note, up to 280 characters</label>
				<Textarea :id="id" :describedby="id + '-count'" v-bind="args" placeholder="Write a note...">
					<template #prefix>✎</template>
					<template #suffix><span :id="id + '-count'">280 left</span></template>
				</Textarea>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};

// Attached controls — stack the textarea with an action button as direct
// children of a vertical FieldGroup; the seams merge into one unit. Set
// `resize="none"` so the joined edge stays tidy.
export const WithFieldGroup: StoryObj = {
	render: (args, { id }) => ({
		components: { Button, Textarea, FieldGroup },
		setup() {
			return { args, id };
		},
		template: `
			<div class="textarea-stack">
				<label :for="id" class="textarea-story-label">Message</label>
				<FieldGroup orientation="vertical" block>
					<Textarea :id="id" v-bind="args" resize="none" placeholder="Write your message..." />
					<Button color="primary" variant="solid" :size="args.size" label="Send" />
				</FieldGroup>
			</div>
		`,
	}),
	args: {
		size: "md",
	},
};
