import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Placeholder from "../../src/components/components/placeholder/Placeholder.vue";

const meta = {
	title: "Theme/Recipes/Layout/Placeholder",
	component: Placeholder,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => ({
		components: { Placeholder },
		template: '<Placeholder class="_height:8">Placeholder content</Placeholder>',
	}),
};
