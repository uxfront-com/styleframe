import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Accordion from "@/components/components/accordion/Accordion.vue";
import AccordionContent from "@/components/components/accordion/AccordionContent.vue";
import AccordionItem from "@/components/components/accordion/AccordionItem.vue";
import AccordionTrigger from "@/components/components/accordion/AccordionTrigger.vue";
import AccordionGrid from "@/components/components/accordion/preview/AccordionGrid.vue";
import AccordionSizeGrid from "@/components/components/accordion/preview/AccordionSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Layout/Accordion",
	component: Accordion,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the accordion surface",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant (enclosed solid or chromeless ghost)",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the accordion",
		},
		type: {
			control: "select",
			options: ["single", "multiple"],
			description: "Whether one or many panels can be open at once",
		},
	},
	render: (args) => ({
		components: {
			Accordion,
			AccordionItem,
			AccordionTrigger,
			AccordionContent,
		},
		setup() {
			return { args };
		},
		template: `
			<Accordion v-bind="args" class="accordion-demo" default-value="item-1">
				<AccordionItem value="item-1">
					<AccordionTrigger>Is it accessible?</AccordionTrigger>
					<AccordionContent>Yes. Each trigger is a button inside a heading and follows the WAI-ARIA disclosure pattern.</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Is it animated?</AccordionTrigger>
					<AccordionContent>Yes. The panel height animates with a pure-CSS grid-rows transition — no JavaScript measurement.</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>Is it styled?</AccordionTrigger>
					<AccordionContent>Yes. Color, variant, and size all come from the accordion recipe.</AccordionContent>
				</AccordionItem>
			</Accordion>
		`,
	}),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { AccordionGrid },
		template: "<AccordionGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { AccordionSizeGrid },
		template: "<AccordionSizeGrid />",
	}),
};

// Individual color stories
export const Neutral: Story = {
	args: {
		color: "neutral",
	},
};

export const Light: Story = {
	args: {
		color: "light",
	},
};

export const Dark: Story = {
	args: {
		color: "dark",
	},
};

// Variant stories
export const Solid: Story = {
	args: {
		variant: "solid",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
	},
};

// Size stories
export const Small: Story = {
	args: {
		size: "sm",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
	},
};

// Behavior stories
export const Multiple: Story = {
	args: {
		type: "multiple",
	},
};
