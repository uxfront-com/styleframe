import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { borderColorValues } from "@styleframe/theme";

import BorderColorSwatch from "../../src/components/design-tokens/borders/BorderColorSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Borders/Border Color",
	component: BorderColorSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(borderColorValues),
		},
	},
} satisfies Meta<typeof BorderColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorderColors: StoryObj = {
	render: () => ({
		components: { BorderColorSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(borderColorValues) };
		},
		template: `
			<StoryGrid :items="items">
				<template #default="{ item }">
					<BorderColorSwatch :name="item" :value="item" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const Default: Story = {
	args: {
		name: "default",
		value: "default",
	},
};

export const Primary: Story = {
	args: {
		name: "primary",
		value: "primary",
	},
};
