import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fontWeightValues } from "@styleframe/theme";

import FontWeightSwatch from "../../src/components/design-tokens/typography/FontWeightSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Typography/Font Weight",
	component: FontWeightSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(fontWeightValues),
		},
	},
} satisfies Meta<typeof FontWeightSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllFontWeights: StoryObj = {
	render: () => ({
		components: { FontWeightSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(fontWeightValues) };
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<FontWeightSwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const ExtraLight: Story = {
	args: {
		name: "extralight",
		value: "extralight",
	},
};

export const Light: Story = {
	args: {
		name: "light",
		value: "light",
	},
};

export const Normal: Story = {
	args: {
		name: "normal",
		value: "normal",
	},
};

export const Medium: Story = {
	args: {
		name: "medium",
		value: "medium",
	},
};

export const Semibold: Story = {
	args: {
		name: "semibold",
		value: "semibold",
	},
};

export const Bold: Story = {
	args: {
		name: "bold",
		value: "bold",
	},
};

export const Black: Story = {
	args: {
		name: "black",
		value: "black",
	},
};
