import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ColorSwatch from "../../src/components/design-tokens/colors/ColorSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const tints = ["base", "50", "100", "150", "200"];
const colors = ["primary", "secondary", "success", "warning", "error", "info", "gray"];

const tintLabels: Record<string, string> = {
	base: "Base",
	"50": "Tint 50 (+5%)",
	"100": "Tint 100 (+10%)",
	"150": "Tint 150 (+15%)",
	"200": "Tint 200 (+20%)",
};

const meta = {
	title: "Design Tokens/Colors/Color Tint",
	component: ColorSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: colors.flatMap((color) => tints.map((tint) => `${color}-tint-${tint}`)),
		},
	},
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { colors, tints, tintLabels };
		},
		template: `
			<div v-for="color in colors" :key="color" style="margin-bottom: 32px;">
				<h3 style="margin-bottom: 12px; text-transform: capitalize;">{{ color }}</h3>
				<StoryGrid :items="tints">
					<template #default="{ item }">
						<ColorSwatch :name="item" :value="\`\${color}-tint-\${item}\`" :label="tintLabels[item]" />
					</template>
				</StoryGrid>
			</div>
		`,
	}),
};

export const PrimaryTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { tints, tintLabels };
		},
		template: `
			<StoryGrid :items="tints">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`primary-tint-\${item}\`" :label="tintLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const SecondaryTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { tints, tintLabels };
		},
		template: `
			<StoryGrid :items="tints">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`secondary-tint-\${item}\`" :label="tintLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const SuccessTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { tints, tintLabels };
		},
		template: `
			<StoryGrid :items="tints">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`success-tint-\${item}\`" :label="tintLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const WarningTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { tints, tintLabels };
		},
		template: `
			<StoryGrid :items="tints">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`warning-tint-\${item}\`" :label="tintLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const ErrorTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { tints, tintLabels };
		},
		template: `
			<StoryGrid :items="tints">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`error-tint-\${item}\`" :label="tintLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const InfoTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { tints, tintLabels };
		},
		template: `
			<StoryGrid :items="tints">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`info-tint-\${item}\`" :label="tintLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const GrayTints: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { tints, tintLabels };
		},
		template: `
			<StoryGrid :items="tints">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`gray-tint-\${item}\`" :label="tintLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const Base: Story = {
	args: {
		name: "base",
		value: "primary-tint-base",
		label: "Base",
	},
};

export const Tint50: Story = {
	args: {
		name: "50",
		value: "primary-tint-50",
		label: "Tint 50 (+5%)",
	},
};

export const Tint100: Story = {
	args: {
		name: "100",
		value: "primary-tint-100",
		label: "Tint 100 (+10%)",
	},
};

export const Tint150: Story = {
	args: {
		name: "150",
		value: "primary-tint-150",
		label: "Tint 150 (+15%)",
	},
};

export const Tint200: Story = {
	args: {
		name: "200",
		value: "primary-tint-200",
		label: "Tint 200 (+20%)",
	},
};
