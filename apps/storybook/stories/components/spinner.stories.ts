import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Spinner from "../../src/components/components/spinner/Spinner.vue";
import SpinnerOverlay from "../../src/components/components/spinner/SpinnerOverlay.vue";
import SpinnerGrid from "../../src/components/components/spinner/preview/SpinnerGrid.vue";
import SpinnerSizeGrid from "../../src/components/components/spinner/preview/SpinnerSizeGrid.vue";

const colors = ["primary", "light", "dark", "neutral"] as const;
const sizes = ["auto", "sm", "md", "lg", "em"] as const;

const meta = {
	title: "Theme/Recipes/Feedback/Spinner",
	component: Spinner,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size",
		},
		label: {
			control: "text",
			description: "Optional label text displayed below the spinner",
		},
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "primary",
		size: "md",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { SpinnerGrid },
		template: "<SpinnerGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { SpinnerSizeGrid },
		template: "<SpinnerSizeGrid />",
	}),
};

// Per-color stories
export const Primary: Story = {
	args: { color: "primary" },
};

export const Light: Story = {
	args: { color: "light" },
};

// dark is for dark surfaces, so it's shown on the overlay's backdrop.
export const Dark: Story = {
	args: { color: "dark" },
	render: (args) => ({
		components: { Spinner, SpinnerOverlay },
		setup() {
			return { args };
		},
		template: `
			<div class="spinner-backdrop">
				<SpinnerOverlay>
					<Spinner v-bind="args" />
				</SpinnerOverlay>
			</div>
		`,
	}),
};

export const Neutral: Story = {
	args: { color: "neutral" },
};

// Per-size stories
export const Auto: StoryObj = {
	render: () => ({
		components: { Spinner },
		template:
			'<div class="_width:[100px] _height:[100px]"><Spinner size="auto" /></div>',
	}),
};

export const Small: Story = {
	args: { size: "sm" },
};

export const Medium: Story = {
	args: { size: "md" },
};

export const Large: Story = {
	args: { size: "lg" },
};

// The em size follows the text around it, in a paragraph or a heading.
export const Em: StoryObj = {
	render: () => ({
		components: { Spinner },
		template: `
			<div class="spinner-section">
				<p class="spinner-text-sample"><Spinner size="em" color="neutral" /> Saving draft</p>
				<h2 class="spinner-heading-sample"><Spinner size="em" color="neutral" /> Loading results</h2>
			</div>
		`,
	}),
};

// Feature stories
export const WithLabel: Story = {
	args: {
		color: "primary",
		size: "md",
		label: "65%",
	},
};
