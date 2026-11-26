import type { Meta, StoryObj } from "@storybook/vue3-vite";

import SkeletonGrid from "../../src/components/components/skeleton/preview/SkeletonGrid.vue";
import SkeletonSizeGrid from "../../src/components/components/skeleton/preview/SkeletonSizeGrid.vue";
import Skeleton from "../../src/components/components/skeleton/Skeleton.vue";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
	title: "Theme/Recipes/Feedback/Skeleton",
	component: Skeleton,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		size: {
			control: "select",
			options: sizes,
			description: "The height size of the skeleton placeholder",
		},
		rounded: {
			control: "boolean",
			description: "Whether to use full border-radius (pill/circle shape)",
		},
	},
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		components: { Skeleton },
		template: `
			<div class="_display:flex _align-items:center _gap:1">
				<Skeleton size="xl" :rounded="true" class="_width:3 _height:3" />
				<div class="_display:grid _gap:0.5">
					<Skeleton size="sm" class="_width:[250px]" />
					<Skeleton size="sm" class="_width:[200px]" />
				</div>
			</div>
		`,
	}),
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { SkeletonGrid },
		template: "<SkeletonGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { SkeletonSizeGrid },
		template: "<SkeletonSizeGrid />",
	}),
};

// Size stories
export const ExtraSmall: Story = {
	args: {
		size: "xs",
	},
};

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

export const ExtraLarge: Story = {
	args: {
		size: "xl",
	},
};

// Rounded story
export const Rounded: Story = {
	args: {
		size: "lg",
		rounded: true,
	},
};
