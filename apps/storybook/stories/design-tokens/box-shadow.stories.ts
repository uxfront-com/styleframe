import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { boxShadowValues } from "@styleframe/theme";

import BoxShadowSwatch from "../../src/components/design-tokens/shadows/BoxShadowSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Shadows/Box Shadow",
	component: BoxShadowSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(boxShadowValues),
		},
	},
} satisfies Meta<typeof BoxShadowSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBoxShadows: StoryObj = {
	render: () => ({
		components: { BoxShadowSwatch, StoryGrid },
		setup() {
			return { items: Object.keys(boxShadowValues) };
		},
		template: `
			<StoryGrid :items="items">
				<template #default="{ item }">
					<BoxShadowSwatch :name="item" :value="item" />
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

export const Inner: Story = {
	args: {
		name: "inner",
		value: "inner",
	},
};

export const Ring: Story = {
	args: {
		name: "ring",
		value: "ring",
	},
};
