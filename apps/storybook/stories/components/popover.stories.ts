import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Popover from "@/components/components/popover/Popover.vue";
import PopoverHeader from "@/components/components/popover/PopoverHeader.vue";
import PopoverBody from "@/components/components/popover/PopoverBody.vue";
import PopoverFooter from "@/components/components/popover/PopoverFooter.vue";
import PopoverArrow from "@/components/components/popover/PopoverArrow.vue";
import PopoverTitle from "@/components/components/popover/PopoverTitle.vue";
import PopoverDescription from "@/components/components/popover/PopoverDescription.vue";
import PopoverGrid from "@/components/components/popover/preview/PopoverGrid.vue";
import PopoverSizeGrid from "@/components/components/popover/preview/PopoverSizeGrid.vue";
import PopoverTopLayer from "@/components/components/popover/preview/PopoverTopLayer.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;
const placements = ["top", "bottom", "start", "end"] as const;

const meta = {
	title: "Theme/Recipes/Overlays/Popover",
	component: Popover,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the popover",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the popover",
		},
	},
	render: (args) => ({
		components: {
			Popover,
			PopoverHeader,
			PopoverBody,
			PopoverFooter,
			PopoverArrow,
			PopoverTitle,
			PopoverDescription,
		},
		setup() {
			return { args };
		},
		template: `
			<div class="popover-wrapper">
				<Popover v-bind="args" class="popover-demo">
					<PopoverHeader v-bind="args">
						<PopoverTitle>Popover Title</PopoverTitle>
					</PopoverHeader>
					<PopoverBody v-bind="args">
						<PopoverDescription>This is a popover description with some content.</PopoverDescription>
					</PopoverBody>
					<PopoverFooter v-bind="args">
						Footer content
					</PopoverFooter>
				</Popover>
				<PopoverArrow v-bind="args" class="popover-arrow-position" />
			</div>
		`,
	}),
} satisfies Meta<typeof Popover>;

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
		components: { PopoverGrid },
		template: "<PopoverGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { PopoverSizeGrid },
		template: "<PopoverSizeGrid />",
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

// Top layer: a `popover` element opened by its trigger, positioned with CSS
// anchor positioning and flipped when there's no room.
export const TopLayer: StoryObj = {
	parameters: { layout: "fullscreen" },
	render: () => ({
		components: { PopoverTopLayer },
		template: "<PopoverTopLayer />",
	}),
};

export const Placements: StoryObj = {
	parameters: { layout: "fullscreen" },
	render: () => ({
		components: { PopoverTopLayer },
		setup() {
			return { placements };
		},
		template:
			'<PopoverTopLayer name="placements" :placements="[...placements]" />',
	}),
};

// Closed, with its trigger ready to take focus and open it.
export const Focus: StoryObj = {
	parameters: { layout: "fullscreen" },
	render: () => ({
		components: { PopoverTopLayer },
		template: '<PopoverTopLayer name="focus" :open="false" />',
	}),
};
