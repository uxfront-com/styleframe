import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { letterSpacingValues } from "@styleframe/theme";

import LetterSpacingSwatch from "../../src/components/design-tokens/typography/LetterSpacingSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Typography/Letter Spacing",
	component: LetterSpacingSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(letterSpacingValues),
		},
	},
} satisfies Meta<typeof LetterSpacingSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLetterSpacings: StoryObj = {
	render: () => ({
		components: { LetterSpacingSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(letterSpacingValues) };
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<LetterSpacingSwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const Tighter: Story = {
	args: {
		name: "tighter",
		value: "tighter",
	},
};

export const Tight: Story = {
	args: {
		name: "tight",
		value: "tight",
	},
};

export const Normal: Story = {
	args: {
		name: "normal",
		value: "normal",
	},
};

export const Wide: Story = {
	args: {
		name: "wide",
		value: "wide",
	},
};

export const Wider: Story = {
	args: {
		name: "wider",
		value: "wider",
	},
};
