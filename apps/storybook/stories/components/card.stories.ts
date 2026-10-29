import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Card from "@/components/components/card/Card.vue";
import CardHeader from "@/components/components/card/CardHeader.vue";
import CardMedia from "@/components/components/card/CardMedia.vue";
import CardBody from "@/components/components/card/CardBody.vue";
import CardFooter from "@/components/components/card/CardFooter.vue";
import CardTitle from "@/components/components/card/CardTitle.vue";
import CardDescription from "@/components/components/card/CardDescription.vue";
import CardGrid from "@/components/components/card/preview/CardGrid.vue";
import CardSizeGrid from "@/components/components/card/preview/CardSizeGrid.vue";
import Button from "@/components/components/button/Button.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Layout/Card",
	component: Card,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the card",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the card",
		},
	},
	render: (args) => ({
		components: {
			Card,
			CardHeader,
			CardBody,
			CardFooter,
			CardTitle,
			CardDescription,
		},
		setup() {
			return { args };
		},
		template: `
			<Card v-bind="args" class="card-preview">
				<CardHeader v-bind="args">
					<CardTitle>Card Title</CardTitle>
				</CardHeader>
				<CardBody v-bind="args">
					<CardDescription>This is a card description with some content.</CardDescription>
				</CardBody>
				<CardFooter v-bind="args">
					Footer content
				</CardFooter>
			</Card>
		`,
	}),
} satisfies Meta<typeof Card>;

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
		components: { CardGrid },
		template: "<CardGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { CardSizeGrid },
		template: "<CardSizeGrid />",
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

export const Soft: Story = {
	args: {
		variant: "soft",
	},
};

export const Subtle: Story = {
	args: {
		variant: "subtle",
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

// States: a card whose heading is a link, with actions, media and long content

const linkedComponents = {
	Card,
	CardHeader,
	CardMedia,
	CardBody,
	CardFooter,
	CardTitle,
	CardDescription,
	Button,
};

export const Linked: StoryObj = {
	render: () => ({
		components: linkedComponents,
		template: `
			<Card class="card-preview">
				<CardHeader>
					<CardTitle href="#analytical-engine">Analytical Engine</CardTitle>
				</CardHeader>
				<CardBody>
					<CardDescription>A general-purpose mechanical computer, designed in 1837.</CardDescription>
				</CardBody>
			</Card>
		`,
	}),
};

export const WithActions: StoryObj = {
	render: () => ({
		components: linkedComponents,
		template: `
			<Card class="card-preview">
				<CardHeader>
					<CardTitle href="#difference-engine">Difference Engine</CardTitle>
				</CardHeader>
				<CardBody>
					<CardDescription>A mechanical calculator for tabulating polynomial functions.</CardDescription>
				</CardBody>
				<CardFooter>
					<Button color="neutral" variant="outline" size="sm" label="Save" />
					<Button color="neutral" variant="ghost" size="sm" label="Share" />
				</CardFooter>
			</Card>
		`,
	}),
};

export const WithMedia: StoryObj = {
	render: () => ({
		components: linkedComponents,
		template: `
			<Card class="card-preview">
				<CardHeader>
					<CardTitle href="#jacquard-loom">Jacquard Loom</CardTitle>
				</CardHeader>
				<CardMedia>
					<svg aria-hidden="true" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
						<circle cx="116" cy="30" r="14" fill="currentColor" opacity="0.3" />
						<path d="M0 90 L52 40 L88 72 L112 54 L160 90 Z" fill="currentColor" opacity="0.2" />
					</svg>
				</CardMedia>
				<CardBody>
					<CardDescription>The media comes after the heading in the DOM, and shows above it.</CardDescription>
				</CardBody>
				<CardFooter>Woven from punched cards</CardFooter>
			</Card>
		`,
	}),
};

export const LongContent: StoryObj = {
	render: () => ({
		components: linkedComponents,
		template: `
			<Card class="card-preview">
				<CardHeader>
					<CardTitle href="#notes">Notes on the Analytical Engine, with a translation of the memoir by Luigi Menabrea</CardTitle>
				</CardHeader>
				<CardBody>
					<CardDescription>https://www.example.com/a-very-long-address-that-has-no-spaces-and-wraps-rather-than-overflowing-the-card</CardDescription>
				</CardBody>
			</Card>
		`,
	}),
};
