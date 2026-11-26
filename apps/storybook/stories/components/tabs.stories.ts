import type { Meta, StoryObj } from "@storybook/vue3-vite";

import TabsGrid from "@/components/components/tabs/preview/TabsGrid.vue";
import TabsOrientationGrid from "@/components/components/tabs/preview/TabsOrientationGrid.vue";
import TabsSizeGrid from "@/components/components/tabs/preview/TabsSizeGrid.vue";
import Tabs from "@/components/components/tabs/Tabs.vue";
import TabsContent from "@/components/components/tabs/TabsContent.vue";
import TabsList from "@/components/components/tabs/TabsList.vue";
import TabsTrigger from "@/components/components/tabs/TabsTrigger.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["line", "pill", "soft"] as const;
const sizes = ["sm", "md", "lg"] as const;
const orientations = ["horizontal", "vertical"] as const;

const meta = {
	title: "Theme/Recipes/Navigation/Tabs",
	component: Tabs,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color surface of the tabs",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style of the tabs",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the tabs",
		},
		orientation: {
			control: "select",
			options: orientations,
			description: "The orientation of the tab bar",
		},
	},
	render: (args) => ({
		components: { Tabs, TabsList, TabsTrigger, TabsContent },
		setup() {
			return { args };
		},
		template: `
			<div class="tabs-demo" :class="{ '-dark': args.color === 'dark' }">
				<Tabs v-bind="args">
					<TabsList>
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="password">Password</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>
					<TabsContent value="account">Make changes to your account here.</TabsContent>
					<TabsContent value="password">Change your password here.</TabsContent>
					<TabsContent value="settings">Manage your settings here.</TabsContent>
				</Tabs>
			</div>
		`,
	}),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		modelValue: "account",
		color: "neutral",
		variant: "line",
		size: "md",
		orientation: "horizontal",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { TabsGrid },
		template: "<TabsGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { TabsSizeGrid },
		template: "<TabsSizeGrid />",
	}),
};

export const Orientations: StoryObj = {
	render: () => ({
		components: { TabsOrientationGrid },
		template: "<TabsOrientationGrid />",
	}),
};

// Variant stories
export const Line: Story = {
	args: { variant: "line" },
};

export const Pill: Story = {
	args: { variant: "pill" },
};

export const Soft: Story = {
	args: { variant: "soft" },
};

// Color stories
export const Neutral: Story = {
	args: { color: "neutral" },
};

export const Light: Story = {
	args: { color: "light" },
};

export const Dark: Story = {
	args: { color: "dark" },
};

// Size stories
export const Small: Story = {
	args: { size: "sm" },
};

export const Medium: Story = {
	args: { size: "md" },
};

export const Large: Story = {
	args: { size: "lg" },
};

// Orientation story
export const Vertical: Story = {
	args: { orientation: "vertical" },
};
