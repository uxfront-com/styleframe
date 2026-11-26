import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fontSizeStaticValues } from "@styleframe/theme";

import FontSizeSwatch from "../../src/components/design-tokens/typography/FontSizeSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Typography/Font Size",
	component: FontSizeSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(fontSizeStaticValues),
		},
	},
} satisfies Meta<typeof FontSizeSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllFontSizes: StoryObj = {
	render: () => ({
		components: { FontSizeSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(fontSizeStaticValues) };
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<FontSizeSwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
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

export const QuadrupleExtraLarge: Story = {
	args: {
		name: "4xl",
		value: "4xl",
	},
};
