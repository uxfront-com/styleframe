import type { Meta, StoryObj } from "@storybook/vue3-vite";

import SidebarGrid from "../../src/components/components/sidebar/preview/SidebarGrid.vue";
import SidebarSizeGrid from "../../src/components/components/sidebar/preview/SidebarSizeGrid.vue";
import Sidebar from "../../src/components/components/sidebar/Sidebar.vue";
import SidebarContent from "../../src/components/components/sidebar/SidebarContent.vue";
import SidebarFooter from "../../src/components/components/sidebar/SidebarFooter.vue";
import SidebarGroup from "../../src/components/components/sidebar/SidebarGroup.vue";
import SidebarGroupAction from "../../src/components/components/sidebar/SidebarGroupAction.vue";
import SidebarGroupLabel from "../../src/components/components/sidebar/SidebarGroupLabel.vue";
import SidebarHeader from "../../src/components/components/sidebar/SidebarHeader.vue";
import SidebarInset from "../../src/components/components/sidebar/SidebarInset.vue";
import SidebarMenu from "../../src/components/components/sidebar/SidebarMenu.vue";
import SidebarMenuAction from "../../src/components/components/sidebar/SidebarMenuAction.vue";
import SidebarMenuBadge from "../../src/components/components/sidebar/SidebarMenuBadge.vue";
import SidebarMenuButton from "../../src/components/components/sidebar/SidebarMenuButton.vue";
import SidebarMenuItem from "../../src/components/components/sidebar/SidebarMenuItem.vue";
import SidebarMenuSub from "../../src/components/components/sidebar/SidebarMenuSub.vue";
import SidebarMenuSubButton from "../../src/components/components/sidebar/SidebarMenuSubButton.vue";
import SidebarSeparator from "../../src/components/components/sidebar/SidebarSeparator.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;

const shell = {
	components: {
		Sidebar,
		SidebarHeader,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupLabel,
		SidebarGroupAction,
		SidebarMenu,
		SidebarMenuItem,
		SidebarMenuButton,
		SidebarMenuAction,
		SidebarMenuBadge,
		SidebarMenuSub,
		SidebarMenuSubButton,
		SidebarSeparator,
		SidebarInset,
	},
	template: `
		<div class="sidebar-shell">
			<Sidebar v-bind="args">
				<SidebarHeader :size="args.size">
					<SidebarMenuButton :color="args.color" :size="args.size" icon="◆" label="Acme Inc" />
				</SidebarHeader>
				<SidebarSeparator :color="args.color" />
				<SidebarContent :size="args.size">
					<SidebarGroup :size="args.size">
						<div class="sidebar-group-header">
							<SidebarGroupLabel :color="args.color" :size="args.size">Platform</SidebarGroupLabel>
							<SidebarGroupAction :size="args.size" label="Add project">＋</SidebarGroupAction>
						</div>
						<SidebarMenu :size="args.size">
							<SidebarMenuItem>
								<SidebarMenuButton :color="args.color" :size="args.size" icon="🏠" label="Dashboard" :active="true" />
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton :color="args.color" :size="args.size" icon="📊" label="Analytics" />
								<SidebarMenuBadge :size="args.size">12</SidebarMenuBadge>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton :color="args.color" :size="args.size" icon="📁" label="Projects" />
								<SidebarMenuAction :size="args.size" label="More actions">⋯</SidebarMenuAction>
								<SidebarMenuSub :size="args.size">
									<SidebarMenuItem>
										<SidebarMenuSubButton :color="args.color" :size="args.size" label="Web app" :active="true" />
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuSubButton :color="args.color" :size="args.size" label="Mobile app" />
									</SidebarMenuItem>
								</SidebarMenuSub>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
					<SidebarGroup :size="args.size">
						<SidebarGroupLabel :color="args.color" :size="args.size">Account</SidebarGroupLabel>
						<SidebarMenu :size="args.size">
							<SidebarMenuItem>
								<SidebarMenuButton :color="args.color" :size="args.size" icon="⚙️" label="Settings" />
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton :color="args.color" :size="args.size" icon="❓" label="Help" :disabled="true" />
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarSeparator :color="args.color" />
				<SidebarFooter :size="args.size">
					<SidebarMenuButton :color="args.color" :size="args.size" icon="👤" label="Jane Cooper" />
				</SidebarFooter>
			</Sidebar>
			<SidebarInset :size="args.size">
				<strong>Dashboard</strong>
				<span>The sidebar sits alongside this main content inset.</span>
			</SidebarInset>
		</div>
	`,
};

const meta = {
	title: "Theme/Recipes/Navigation/Sidebar",
	component: Sidebar,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the sidebar surface",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style of the sidebar surface",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the sidebar",
		},
		collapsed: {
			control: "boolean",
			description: "Collapse the sidebar to the icon-only rail",
		},
	},
	render: (args) => ({
		...shell,
		setup() {
			return { args };
		},
	}),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
		collapsed: false,
	},
};

export const Collapsed: Story = {
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
		collapsed: true,
	},
};

export const AllVariants: StoryObj = {
	parameters: { layout: "padded" },
	render: () => ({
		components: { SidebarGrid },
		template: "<SidebarGrid />",
	}),
};

export const AllSizes: StoryObj = {
	parameters: { layout: "padded" },
	render: () => ({
		components: { SidebarSizeGrid },
		template: "<SidebarSizeGrid />",
	}),
};

// Individual color stories
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
