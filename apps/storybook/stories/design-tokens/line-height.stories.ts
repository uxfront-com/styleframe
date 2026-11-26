import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { lineHeightValues } from "@styleframe/theme";

import LineHeightSwatch from "../../src/components/design-tokens/typography/LineHeightSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Typography/Line Height",
	component: LineHeightSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(lineHeightValues),
		},
	},
} satisfies Meta<typeof LineHeightSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLineHeights: StoryObj = {
	render: () => ({
		components: { LineHeightSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(lineHeightValues) };
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<LineHeightSwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const Tight: Story = {
	args: {
		name: "tight",
		value: "tight",
	},
};

export const Snug: Story = {
	args: {
		name: "snug",
		value: "snug",
	},
};

export const Normal: Story = {
	args: {
		name: "normal",
		value: "normal",
	},
};

export const Relaxed: Story = {
	args: {
		name: "relaxed",
		value: "relaxed",
	},
};

export const Loose: Story = {
	args: {
		name: "loose",
		value: "loose",
	},
};
