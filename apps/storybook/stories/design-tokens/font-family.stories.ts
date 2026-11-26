import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { fontFamilyValues } from "@styleframe/theme";

import FontFamilySwatch from "../../src/components/design-tokens/typography/FontFamilySwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Typography/Font Family",
	component: FontFamilySwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(fontFamilyValues),
		},
	},
} satisfies Meta<typeof FontFamilySwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllFontFamilies: StoryObj = {
	render: () => ({
		components: { FontFamilySwatch, StoryGrid },
		setup() {
			return { items: Object.keys(fontFamilyValues) };
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<FontFamilySwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const Base: Story = {
	args: {
		name: "base",
		value: "base",
	},
};

export const Print: Story = {
	args: {
		name: "print",
		value: "print",
	},
};

export const Mono: Story = {
	args: {
		name: "mono",
		value: "mono",
	},
};
