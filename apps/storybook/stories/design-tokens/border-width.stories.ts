import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { borderWidthValues } from "@styleframe/theme";

import BorderWidthSwatch from "../../src/components/design-tokens/borders/BorderWidthSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Borders/Border Width",
	component: BorderWidthSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(borderWidthValues),
		},
	},
} satisfies Meta<typeof BorderWidthSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorderWidths: StoryObj = {
	render: () => ({
		components: { BorderWidthSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(borderWidthValues) };
		},
		template: `
			<StoryGrid :items="items">
				<template #default="{ item }">
					<BorderWidthSwatch :name="item" :value="item" />
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

export const Thin: Story = {
	args: {
		name: "thin",
		value: "thin",
	},
};

export const Medium: Story = {
	args: {
		name: "medium",
		value: "medium",
	},
};

export const Thick: Story = {
	args: {
		name: "thick",
		value: "thick",
	},
};
