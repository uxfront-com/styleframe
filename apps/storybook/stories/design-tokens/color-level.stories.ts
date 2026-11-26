import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { colorLevelValues } from "@styleframe/theme";

import ColorLevelSwatch from "../../src/components/design-tokens/colors/ColorLevelSwatch.vue";
import StoryGrid from "../../src/components/primitives/StoryGrid.vue";

const levels = Object.keys(colorLevelValues);
const colors = ["primary", "secondary", "success", "warning", "error", "info", "gray"];

const meta = {
	title: "Design Tokens/Colors/Color Level",
	component: ColorLevelSwatch,
	tags: ["autodocs"],
	argTypes: {
		value: {
			control: "select",
			options: colors.flatMap((color) => levels.map((level) => `${color}-${level}`)),
		},
	},
} satisfies Meta<typeof ColorLevelSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLevelValues: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { colors, levels };
		},
		template: `
			<div v-for="color in colors" :key="color" style="margin-bottom: 32px;">
				<h3 style="margin-bottom: 12px; text-transform: capitalize;">{{ color }}</h3>
				<StoryGrid :items="levels">
					<template #default="{ item }">
						<ColorLevelSwatch :name="item" :value="\`\${color}-\${item}\`" />
					</template>
				</StoryGrid>
			</div>
		`,
	}),
};

export const PrimaryLevels: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { levels };
		},
		template: `
			<StoryGrid :items="levels">
				<template #default="{ item }">
					<ColorLevelSwatch :name="item" :value="\`primary-\${item}\`" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const SecondaryLevels: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { levels };
		},
		template: `
			<StoryGrid :items="levels">
				<template #default="{ item }">
					<ColorLevelSwatch :name="item" :value="\`secondary-\${item}\`" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const SuccessLevels: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { levels };
		},
		template: `
			<StoryGrid :items="levels">
				<template #default="{ item }">
					<ColorLevelSwatch :name="item" :value="\`success-\${item}\`" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const WarningLevels: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { levels };
		},
		template: `
			<StoryGrid :items="levels">
				<template #default="{ item }">
					<ColorLevelSwatch :name="item" :value="\`warning-\${item}\`" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const ErrorLevels: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { levels };
		},
		template: `
			<StoryGrid :items="levels">
				<template #default="{ item }">
					<ColorLevelSwatch :name="item" :value="\`error-\${item}\`" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const InfoLevels: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { levels };
		},
		template: `
			<StoryGrid :items="levels">
				<template #default="{ item }">
					<ColorLevelSwatch :name="item" :value="\`info-\${item}\`" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const GrayLevels: StoryObj = {
	render: () => ({
		components: { ColorLevelSwatch, StoryGrid },
		setup() {
			return { levels };
		},
		template: `
			<StoryGrid :items="levels">
				<template #default="{ item }">
					<ColorLevelSwatch :name="item" :value="\`gray-\${item}\`" />
				</template>
			</StoryGrid>
		`,
	}),
};

export const Level50: Story = {
	args: {
		name: "50",
		value: "primary-50",
	},
};

export const Level100: Story = {
	args: {
		name: "100",
		value: "primary-100",
	},
};

export const Level200: Story = {
	args: {
		name: "200",
		value: "primary-200",
	},
};

export const Level300: Story = {
	args: {
		name: "300",
		value: "primary-300",
	},
};

export const Level400: Story = {
	args: {
		name: "400",
		value: "primary-400",
	},
};

export const Level500: Story = {
	args: {
		name: "500",
		value: "primary-500",
	},
};

export const Level600: Story = {
	args: {
		name: "600",
		value: "primary-600",
	},
};

export const Level700: Story = {
	args: {
		name: "700",
		value: "primary-700",
	},
};

export const Level800: Story = {
	args: {
		name: "800",
		value: "primary-800",
	},
};

export const Level900: Story = {
	args: {
		name: "900",
		value: "primary-900",
	},
};

export const Level950: Story = {
	args: {
		name: "950",
		value: "primary-950",
	},
};
