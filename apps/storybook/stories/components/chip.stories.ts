import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Chip from "../../src/components/components/chip/Chip.vue";
import ChipIndicator from "../../src/components/components/chip/ChipIndicator.vue";
import ChipGrid from "../../src/components/components/chip/preview/ChipGrid.vue";
import ChipPositionGrid from "../../src/components/components/chip/preview/ChipPositionGrid.vue";
import ChipSizeGrid from "../../src/components/components/chip/preview/ChipSizeGrid.vue";

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
const variants = ["solid", "soft"] as const;
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const positions = ["top-right", "top-left", "bottom-right", "bottom-left"] as const;

const meta = {
	title: "Theme/Recipes/Feedback/Chip",
	component: Chip,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the chip indicator",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the chip indicator",
		},
		position: {
			control: "select",
			options: positions,
			description: "The position of the chip indicator",
		},
		inset: {
			control: "boolean",
			description: "Whether the chip is positioned inside the wrapped element",
		},
		text: {
			control: "text",
			description: "The text content of the chip indicator",
		},
	},
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: `
			<Chip>
				<div class="chip-target" />
				<ChipIndicator
					:color="args.color"
					:variant="args.variant"
					:size="args.size"
					:position="args.position"
					:inset="args.inset"
					:text="args.text"
				/>
			</Chip>
		`,
	}),
	args: {
		color: "primary",
		variant: "solid",
		size: "md",
		position: "top-right",
		inset: false,
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { ChipGrid },
		template: "<ChipGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { ChipSizeGrid },
		template: "<ChipSizeGrid />",
	}),
};

export const AllPositions: StoryObj = {
	render: () => ({
		components: { ChipPositionGrid },
		template: "<ChipPositionGrid />",
	}),
};

// Individual color stories
export const Primary: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "primary" },
};

export const Secondary: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "secondary" },
};

export const Success: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "success" },
};

export const Info: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "info" },
};

export const Warning: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "warning" },
};

export const Error: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "error" },
};

export const Light: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "light" },
};

export const Dark: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "dark" },
};

export const Neutral: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :color="args.color" /></Chip>',
	}),
	args: { color: "neutral" },
};

// Variant stories
export const Solid: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :variant="args.variant" /></Chip>',
	}),
	args: { variant: "solid" },
};

export const Soft: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :variant="args.variant" /></Chip>',
	}),
	args: { variant: "soft" },
};

// Size stories
export const ExtraSmall: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :size="args.size" /></Chip>',
	}),
	args: { size: "xs" },
};

export const Small: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :size="args.size" /></Chip>',
	}),
	args: { size: "sm" },
};

export const Medium: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :size="args.size" /></Chip>',
	}),
	args: { size: "md" },
};

export const Large: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :size="args.size" /></Chip>',
	}),
	args: { size: "lg" },
};

export const ExtraLarge: Story = {
	render: (args) => ({
		components: { Chip, ChipIndicator },
		setup() {
			return { args };
		},
		template: '<Chip><div class="chip-target" /><ChipIndicator :size="args.size" /></Chip>',
	}),
	args: { size: "xl" },
};

// Feature stories
export const Inset: Story = {
	render: () => ({
		components: { Chip, ChipIndicator },
		template: '<Chip><div class="chip-target" /><ChipIndicator :inset="true" /></Chip>',
	}),
};

export const WithText: Story = {
	render: () => ({
		components: { Chip, ChipIndicator },
		template: '<Chip><div class="chip-target" /><ChipIndicator text="5" size="sm" /></Chip>',
	}),
};
