import type { Meta, StoryObj } from "@storybook/vue3-vite";

import SliderGrid from "../../src/components/components/slider/preview/SliderGrid.vue";
import SliderSizeGrid from "../../src/components/components/slider/preview/SliderSizeGrid.vue";
import Slider from "../../src/components/components/slider/Slider.vue";

const colors = [
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"light",
	"dark",
	"neutral",
] as const;
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Slider",
	component: Slider,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color of the range fill and thumb",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the track and thumb",
		},
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
			description: "The orientation of the slider",
		},
		disabled: {
			control: "boolean",
			description: "Whether the slider is disabled",
		},
	},
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "primary",
		size: "md",
		orientation: "horizontal",
		disabled: false,
	},
};

export const AllColors: StoryObj = {
	render: () => ({
		components: { SliderGrid },
		template: "<SliderGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { SliderSizeGrid },
		template: "<SliderSizeGrid />",
	}),
};

export const Vertical: StoryObj = {
	render: () => ({
		components: { Slider },
		template: `
			<div class="_display:flex _gap:1.5 _height:[200px]">
				<Slider orientation="vertical" color="primary" />
				<Slider orientation="vertical" color="success" />
				<Slider orientation="vertical" color="warning" />
				<Slider orientation="vertical" color="error" />
				<Slider orientation="vertical" color="neutral" />
			</div>
		`,
	}),
};

export const Disabled: Story = {
	args: {
		color: "primary",
		disabled: true,
	},
};

// Individual color stories
export const Primary: Story = { args: { color: "primary" } };
export const Secondary: Story = { args: { color: "secondary" } };
export const Success: Story = { args: { color: "success" } };
export const Info: Story = { args: { color: "info" } };
export const Warning: Story = { args: { color: "warning" } };
export const Error: Story = { args: { color: "error" } };
export const Light: Story = { args: { color: "light" } };
export const Dark: Story = { args: { color: "dark" } };
export const Neutral: Story = { args: { color: "neutral" } };

// Size stories
export const ExtraSmall: Story = { args: { size: "xs" } };
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
