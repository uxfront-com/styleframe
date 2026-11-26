import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ColorSwatch from "../../src/components/design-tokens/colors/ColorSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const shades = ["base", "50", "100", "150", "200"];
const colors = ["primary", "secondary", "success", "warning", "error", "info", "gray"];

const shadeLabels: Record<string, string> = {
	base: "Base",
	"50": "Shade 50 (-5%)",
	"100": "Shade 100 (-10%)",
	"150": "Shade 150 (-15%)",
	"200": "Shade 200 (-20%)",
};

const meta = {
	title: "Design Tokens/Colors/Color Shade",
	component: ColorSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: colors.flatMap((color) => shades.map((shade) => `${color}-shade-${shade}`)),
		},
	},
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { colors, shades, shadeLabels };
		},
		template: `
			<div v-for="color in colors" :key="color" style="margin-bottom: 32px;">
				<h3 style="margin-bottom: 12px; text-transform: capitalize;">{{ color }}</h3>
				<StoryGrid :items="shades">
					<template #default="{ item }">
						<ColorSwatch :name="item" :value="\`\${color}-shade-\${item}\`" :label="shadeLabels[item]" />
					</template>
				</StoryGrid>
			</div>
		`,
	}),
};

export const PrimaryShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { shades, shadeLabels };
		},
		template: `
			<StoryGrid :items="shades">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`primary-shade-\${item}\`" :label="shadeLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const SecondaryShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { shades, shadeLabels };
		},
		template: `
			<StoryGrid :items="shades">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`secondary-shade-\${item}\`" :label="shadeLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const SuccessShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { shades, shadeLabels };
		},
		template: `
			<StoryGrid :items="shades">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`success-shade-\${item}\`" :label="shadeLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const WarningShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { shades, shadeLabels };
		},
		template: `
			<StoryGrid :items="shades">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`warning-shade-\${item}\`" :label="shadeLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const ErrorShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { shades, shadeLabels };
		},
		template: `
			<StoryGrid :items="shades">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`error-shade-\${item}\`" :label="shadeLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const InfoShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { shades, shadeLabels };
		},
		template: `
			<StoryGrid :items="shades">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`info-shade-\${item}\`" :label="shadeLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const GrayShades: StoryObj = {
	render: () => ({
		components: { ColorSwatch, StoryGrid },
		setup() {
			return { shades, shadeLabels };
		},
		template: `
			<StoryGrid :items="shades">
				<template #default="{ item }">
					<ColorSwatch :name="item" :value="\`gray-shade-\${item}\`" :label="shadeLabels[item]" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const Base: Story = {
	args: {
		name: "base",
		value: "primary-shade-base",
		label: "Base",
	},
};

export const Shade50: Story = {
	args: {
		name: "50",
		value: "primary-shade-50",
		label: "Shade 50 (-5%)",
	},
};

export const Shade100: Story = {
	args: {
		name: "100",
		value: "primary-shade-100",
		label: "Shade 100 (-10%)",
	},
};

export const Shade150: Story = {
	args: {
		name: "150",
		value: "primary-shade-150",
		label: "Shade 150 (-15%)",
	},
};

export const Shade200: Story = {
	args: {
		name: "200",
		value: "primary-shade-200",
		label: "Shade 200 (-20%)",
	},
};
