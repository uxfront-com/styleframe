import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Button from "@/components/components/button/Button.vue";
import Drawer from "@/components/components/drawer/Drawer.vue";
import DrawerBody from "@/components/components/drawer/DrawerBody.vue";
import DrawerDescription from "@/components/components/drawer/DrawerDescription.vue";
import DrawerFooter from "@/components/components/drawer/DrawerFooter.vue";
import DrawerHeader from "@/components/components/drawer/DrawerHeader.vue";
import DrawerOverlay from "@/components/components/drawer/DrawerOverlay.vue";
import DrawerTitle from "@/components/components/drawer/DrawerTitle.vue";
import DrawerGrid from "@/components/components/drawer/preview/DrawerGrid.vue";
import DrawerSideGrid from "@/components/components/drawer/preview/DrawerSideGrid.vue";
import DrawerSizeGrid from "@/components/components/drawer/preview/DrawerSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;
const sides = ["top", "right", "bottom", "left"] as const;

const meta = {
	title: "Theme/Recipes/Overlays/Drawer",
	component: Drawer,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the drawer",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The panel thickness",
		},
		side: {
			control: "select",
			options: sides,
			description: "The screen edge the drawer anchors to",
		},
	},
	render: (args) => ({
		components: {
			Button,
			Drawer,
			DrawerOverlay,
			DrawerHeader,
			DrawerBody,
			DrawerFooter,
			DrawerTitle,
			DrawerDescription,
		},
		setup() {
			const isOpen = ref(true);
			return { args, isOpen };
		},
		template: `
			<Button label="Open Drawer" @click="isOpen = true" />
			<DrawerOverlay v-show="isOpen" @click.self="isOpen = false">
				<Drawer v-bind="args">
					<DrawerHeader v-bind="args">
						<DrawerTitle>Drawer Title</DrawerTitle>
					</DrawerHeader>
					<DrawerBody v-bind="args">
						<DrawerDescription>This is a drawer description with some content.</DrawerDescription>
					</DrawerBody>
					<DrawerFooter v-bind="args">
						<Button label="Close" v-bind="args" @click="isOpen = false" />
					</DrawerFooter>
				</Drawer>
			</DrawerOverlay>
		`,
	}),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
		side: "right",
	},
};

export const Sides: StoryObj = {
	render: () => ({
		components: { DrawerSideGrid },
		template: "<DrawerSideGrid />",
	}),
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { DrawerGrid },
		template: "<DrawerGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { DrawerSizeGrid },
		template: "<DrawerSizeGrid />",
	}),
};

// Side stories
export const Left: Story = {
	args: {
		side: "left",
	},
};

export const Right: Story = {
	args: {
		side: "right",
	},
};

export const Top: Story = {
	args: {
		side: "top",
	},
};

export const Bottom: Story = {
	args: {
		side: "bottom",
	},
};

// Color stories
export const Neutral: Story = {
	args: {
		color: "neutral",
	},
};

export const Light: Story = {
	args: {
		color: "light",
	},
};

export const Dark: Story = {
	args: {
		color: "dark",
	},
};

// Variant stories
export const Solid: Story = {
	args: {
		variant: "solid",
	},
};

export const Soft: Story = {
	args: {
		variant: "soft",
	},
};

export const Subtle: Story = {
	args: {
		variant: "subtle",
	},
};

// Size stories
export const Small: Story = {
	args: {
		size: "sm",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
	},
};
