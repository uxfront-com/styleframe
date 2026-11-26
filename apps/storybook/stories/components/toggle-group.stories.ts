import type { Meta, StoryObj } from "@storybook/vue3-vite";

import FieldGroup from "@/components/components/field-group/FieldGroup.vue";
import ToggleCustomGrid from "@/components/components/toggle/preview/ToggleCustomGrid.vue";
import ToggleGroupGrid from "@/components/components/toggle/preview/ToggleGroupGrid.vue";
import Toggle from "@/components/components/toggle/Toggle.vue";
import ToggleGroup from "@/components/components/toggle/ToggleGroup.vue";

const orientations = ["horizontal", "vertical"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Toggle Group",
	component: ToggleGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: orientations,
			description: "The layout direction of the group",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The gap between toggles",
		},
	},
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		components: { ToggleGroup, Toggle },
		setup() {
			return { args };
		},
		template: `
			<ToggleGroup v-bind="args">
				<Toggle variant="outline" pressed label="Bold" />
				<Toggle variant="outline" label="Italic" />
				<Toggle variant="outline" label="Underline" />
			</ToggleGroup>
		`,
	}),
	args: {
		orientation: "horizontal",
		size: "md",
	},
};

export const AllOrientations: StoryObj = {
	render: () => ({
		components: { ToggleGroupGrid },
		template: "<ToggleGroupGrid />",
	}),
};

export const Horizontal: Story = {
	render: (args) => ({
		components: { ToggleGroup, Toggle },
		setup() {
			return { args };
		},
		template: `
			<ToggleGroup v-bind="args">
				<Toggle variant="outline" pressed label="Left" />
				<Toggle variant="outline" label="Center" />
				<Toggle variant="outline" label="Right" />
			</ToggleGroup>
		`,
	}),
	args: {
		orientation: "horizontal",
		size: "md",
	},
};

export const Vertical: Story = {
	render: (args) => ({
		components: { ToggleGroup, Toggle },
		setup() {
			return { args };
		},
		template: `
			<ToggleGroup v-bind="args">
				<Toggle variant="outline" pressed label="List" />
				<Toggle variant="outline" label="Grid" />
				<Toggle variant="outline" label="Columns" />
			</ToggleGroup>
		`,
	}),
	args: {
		orientation: "vertical",
		size: "md",
	},
};

// Connected segmented control — toggles joined at the seams via the existing
// field-group recipe (no toggle-group axis needed).
export const Connected: StoryObj = {
	render: () => ({
		components: { FieldGroup, Toggle },
		template: `
			<FieldGroup>
				<Toggle variant="outline" pressed label="Left" />
				<Toggle variant="outline" label="Center" />
				<Toggle variant="outline" label="Right" />
			</FieldGroup>
		`,
	}),
};

// Custom — a font-weight picker built from outline toggles joined with field-group,
// each cell showing "Aa" at its weight plus a label.
export const Custom: StoryObj = {
	render: () => ({
		components: { ToggleCustomGrid },
		template: "<ToggleCustomGrid />",
	}),
};
