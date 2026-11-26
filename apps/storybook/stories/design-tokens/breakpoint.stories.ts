import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { breakpointValues } from "@styleframe/theme";

import BreakpointSwatch from "../../src/components/design-tokens/layout/BreakpointSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Layout/Breakpoint",
	component: BreakpointSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(breakpointValues),
		},
	},
} satisfies Meta<typeof BreakpointSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllBreakpoints: StoryObj = {
	render: () => ({
		components: { BreakpointSwatch, StoryGrid },
		setup() {
			return {
				items: Object.keys(breakpointValues),
				breakpointValues,
			};
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<BreakpointSwatch :name="item" :value="breakpointValues[item] + 'px'" :width="breakpointValues[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const ExtraSmall: Story = {
	args: {
		name: "xs",
		value: `${breakpointValues.xs}px`,
		width: breakpointValues.xs,
	},
};

export const Small: Story = {
	args: {
		name: "sm",
		value: `${breakpointValues.sm}px`,
		width: breakpointValues.sm,
	},
};

export const Medium: Story = {
	args: {
		name: "md",
		value: `${breakpointValues.md}px`,
		width: breakpointValues.md,
	},
};

export const Large: Story = {
	args: {
		name: "lg",
		value: `${breakpointValues.lg}px`,
		width: breakpointValues.lg,
	},
};

export const ExtraLarge: Story = {
	args: {
		name: "xl",
		value: `${breakpointValues.xl}px`,
		width: breakpointValues.xl,
	},
};

export const ExtraExtraLarge: Story = {
	args: {
		name: "2xl",
		value: `${breakpointValues["2xl"]}px`,
		width: breakpointValues["2xl"],
	},
};
