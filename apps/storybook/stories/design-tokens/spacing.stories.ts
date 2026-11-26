import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { spacingValues } from "@styleframe/theme";

import SpacingSwatch from "../../src/components/design-tokens/spacing/SpacingSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Spacing/Spacing",
	component: SpacingSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(spacingValues),
		},
	},
} satisfies Meta<typeof SpacingSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSpacings: StoryObj = {
	render: () => ({
		components: { SpacingSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(spacingValues) };
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<SpacingSwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const DoubleExtraSmall: Story = {
	args: {
		name: "2xs",
		value: "2xs",
	},
};

export const ExtraSmall: Story = {
	args: {
		name: "xs",
		value: "xs",
	},
};

export const Small: Story = {
	args: {
		name: "sm",
		value: "sm",
	},
};

export const Medium: Story = {
	args: {
		name: "md",
		value: "md",
	},
};

export const Large: Story = {
	args: {
		name: "lg",
		value: "lg",
	},
};

export const ExtraLarge: Story = {
	args: {
		name: "xl",
		value: "xl",
	},
};

export const DoubleExtraLarge: Story = {
	args: {
		name: "2xl",
		value: "2xl",
	},
};

export const TripleExtraLarge: Story = {
	args: {
		name: "3xl",
		value: "3xl",
	},
};
