import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { borderRadiusValues } from "@styleframe/theme";

import BorderRadiusSwatch from "../../src/components/design-tokens/borders/BorderRadiusSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Borders/Border Radius",
	component: BorderRadiusSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(borderRadiusValues),
		},
	},
} satisfies Meta<typeof BorderRadiusSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBorderRadiuses: StoryObj = {
	render: () => ({
		components: { BorderRadiusSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(borderRadiusValues) };
		},
		template: `
			<StoryGrid :items="items">
				<template #default="{ item }">
					<BorderRadiusSwatch :name="item" :value="item" />
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

export const Full: Story = {
	args: {
		name: "full",
		value: "full",
	},
};
