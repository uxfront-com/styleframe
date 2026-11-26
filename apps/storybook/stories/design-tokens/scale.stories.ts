import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { scaleValues } from "@styleframe/theme";

import ScaleSwatch from "../../src/components/design-tokens/scales/ScaleSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const meta = {
	title: "Design Tokens/Scales/Scale",
	component: ScaleSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: Object.keys(scaleValues),
		},
	},
} satisfies Meta<typeof ScaleSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllScales: StoryObj = {
	render: () => ({
		components: { ScaleSwatch, StoryGrid },
		setup() {
			return {
				items: Object.keys(scaleValues),
				scaleValues,
			};
		},
		template: `
			<StoryGrid :items="items" layout="list">
				<template #default="{ item }">
					<ScaleSwatch :name="item" :value="String(scaleValues[item])" :ratio="scaleValues[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const MinorSecond: Story = {
	args: {
		name: "minor-second",
		value: String(scaleValues["minor-second"]),
		ratio: scaleValues["minor-second"],
	},
};

export const MajorSecond: Story = {
	args: {
		name: "major-second",
		value: String(scaleValues["major-second"]),
		ratio: scaleValues["major-second"],
	},
};

export const MinorThird: Story = {
	args: {
		name: "minor-third",
		value: String(scaleValues["minor-third"]),
		ratio: scaleValues["minor-third"],
	},
};

export const MajorThird: Story = {
	args: {
		name: "major-third",
		value: String(scaleValues["major-third"]),
		ratio: scaleValues["major-third"],
	},
};

export const PerfectFourth: Story = {
	args: {
		name: "perfect-fourth",
		value: String(scaleValues["perfect-fourth"]),
		ratio: scaleValues["perfect-fourth"],
	},
};

export const AugmentedFourth: Story = {
	args: {
		name: "augmented-fourth",
		value: String(scaleValues["augmented-fourth"]),
		ratio: scaleValues["augmented-fourth"],
	},
};

export const PerfectFifth: Story = {
	args: {
		name: "perfect-fifth",
		value: String(scaleValues["perfect-fifth"]),
		ratio: scaleValues["perfect-fifth"],
	},
};

export const Golden: Story = {
	args: {
		name: "golden",
		value: String(scaleValues.golden),
		ratio: scaleValues.golden,
	},
};
