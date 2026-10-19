import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Select from "@/components/components/select/Select.vue";
import SelectChip from "@/components/components/select/SelectChip.vue";
import SelectLabel from "@/components/components/select/SelectLabel.vue";
import SelectOption from "@/components/components/select/SelectOption.vue";
import SelectPanel from "@/components/components/select/SelectPanel.vue";
import SelectSeparator from "@/components/components/select/SelectSeparator.vue";
import SelectGrid from "@/components/components/select/preview/SelectGrid.vue";
import SelectSizeGrid from "@/components/components/select/preview/SelectSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Select",
	component: Select,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the select",
		},
		variant: {
			control: "select",
			options: variants,
			// The inferred union type makes Storybook drop `variant` URL args.
			type: { name: "enum", value: [...variants] },
			description: "The visual style of the trigger (solid, soft, ghost)",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the select",
		},
		invalid: {
			control: "boolean",
			description: "Whether the select is in an invalid state",
		},
		readonly: {
			control: "boolean",
			description: "Whether the select is read-only",
		},
	},
	render: (args) => ({
		components: {
			Select,
			SelectChip,
			SelectPanel,
			SelectOption,
			SelectLabel,
			SelectSeparator,
		},
		setup() {
			// Trigger variants (solid/soft/ghost) map onto the panel's
			// vocabulary (solid/soft/subtle); ghost reads as subtle on a surface.
			const panelVariant =
				args.variant === "ghost" ? "subtle" : (args.variant ?? "solid");
			return { args, panelVariant };
		},
		template: `
			<div class="select-wrapper">
				<Select v-bind="args" :open="true">
					<SelectChip :color="args.color" :size="args.size">Apple</SelectChip>
					<SelectChip :color="args.color" :size="args.size">Banana</SelectChip>
				</Select>
				<SelectPanel :color="args.color" :variant="panelVariant" :size="args.size">
					<SelectLabel :color="args.color" :size="args.size">Fruits</SelectLabel>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size" :selected="true">Apple</SelectOption>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size" :selected="true">Banana</SelectOption>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size">Cherry</SelectOption>
					<SelectSeparator :color="args.color" />
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size" :disabled="true">Durian (out of stock)</SelectOption>
				</SelectPanel>
			</div>
		`,
	}),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Single selection with leading icons — a country selector. The trigger shows
// the selected value's flag; each option carries its own flag with a trailing
// check on the selected row. Driven by the color / variant / size controls.
export const Default: Story = {
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
	},
	render: (args) => ({
		components: {
			Select,
			SelectPanel,
			SelectOption,
			SelectLabel,
			SelectSeparator,
		},
		setup() {
			const panelVariant =
				args.variant === "ghost" ? "subtle" : (args.variant ?? "solid");
			return { args, panelVariant };
		},
		template: `
			<div class="select-wrapper">
				<Select v-bind="args" :open="true">
					<template #icon>🇺🇸</template>
					<span class="select-value">United States</span>
				</Select>
				<SelectPanel :color="args.color" :variant="panelVariant" :size="args.size">
					<SelectLabel :color="args.color" :size="args.size">Popular</SelectLabel>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size" :selected="true">
						<template #icon>🇺🇸</template>
						United States
					</SelectOption>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size">
						<template #icon>🇬🇧</template>
						United Kingdom
					</SelectOption>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size">
						<template #icon>🇫🇷</template>
						France
					</SelectOption>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size">
						<template #icon>🇩🇪</template>
						Germany
					</SelectOption>
					<SelectSeparator :color="args.color" />
					<SelectLabel :color="args.color" :size="args.size">Coming soon</SelectLabel>
					<SelectOption :color="args.color" :variant="panelVariant" :size="args.size" :disabled="true">
						<template #icon>🇯🇵</template>
						Japan
					</SelectOption>
				</SelectPanel>
			</div>
		`,
	}),
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { SelectGrid },
		template: "<SelectGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { SelectSizeGrid },
		template: "<SelectSizeGrid />",
	}),
};

// Multi-selection with dismissable chips — the headline feature.
export const Multiselect: StoryObj = {
	render: () => ({
		components: { Select, SelectChip, SelectPanel, SelectOption },
		template: `
			<div class="select-wrapper">
				<Select color="neutral" variant="solid" size="md" :open="true">
					<SelectChip color="neutral" size="md">Design</SelectChip>
					<SelectChip color="neutral" size="md">Engineering</SelectChip>
					<SelectChip color="neutral" size="md">Product</SelectChip>
				</Select>
				<SelectPanel color="neutral" variant="solid" size="md">
					<SelectOption color="neutral" variant="solid" :selected="true">Design</SelectOption>
					<SelectOption color="neutral" variant="solid" :selected="true">Engineering</SelectOption>
					<SelectOption color="neutral" variant="solid" :selected="true">Product</SelectOption>
					<SelectOption color="neutral" variant="solid">Marketing</SelectOption>
					<SelectOption color="neutral" variant="solid">Sales</SelectOption>
				</SelectPanel>
			</div>
		`,
	}),
};

// Color stories
export const Neutral: Story = {
	args: { color: "neutral" },
};

export const Light: Story = {
	args: { color: "light" },
};

export const Dark: Story = {
	args: { color: "dark" },
};

// Variant stories (trigger vocabulary)
export const Solid: Story = {
	args: { variant: "solid" },
};

export const Soft: Story = {
	args: { variant: "soft" },
};

export const Ghost: Story = {
	args: { variant: "ghost" },
};

// State stories
export const ReadOnly: Story = {
	args: {
		readonly: true,
		modelValue: "United States",
	},
	render: (args) => ({
		components: { Select },
		setup() {
			return { args };
		},
		template: `
			<div class="select-wrapper">
				<Select v-bind="args" />
			</div>
		`,
	}),
};

// Size stories
export const Small: Story = {
	args: { size: "sm" },
};

export const Medium: Story = {
	args: { size: "md" },
};

export const Large: Story = {
	args: { size: "lg" },
};
