import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { borderStyleValues } from "@styleframe/theme";

import BorderStyleSwatch from "../../src/components/design-tokens/borders/BorderStyleSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Borders/Border Style",
	component: BorderStyleSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(borderStyleValues),
		},
	},
} satisfies Meta<typeof BorderStyleSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorderStyles: StoryObj = {
	render: () => ({
		components: { BorderStyleSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(borderStyleValues) };
		},
		template: `
			<StoryGrid :items="items">
				<template #default="{ item }">
					<BorderStyleSwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const None: Story = {
	args: {
		name: "none",
		value: "none",
	},
};

export const Solid: Story = {
	args: {
		name: "solid",
		value: "solid",
	},
};

export const Dashed: Story = {
	args: {
		name: "dashed",
		value: "dashed",
	},
};

export const Dotted: Story = {
	args: {
		name: "dotted",
		value: "dotted",
	},
};

export const Double: Story = {
	args: {
		name: "double",
		value: "double",
	},
};

export const Groove: Story = {
	args: {
		name: "groove",
		value: "groove",
	},
};

export const Inset: Story = {
	args: {
		name: "inset",
		value: "inset",
	},
};

export const Outset: Story = {
	args: {
		name: "outset",
		value: "outset",
	},
};
