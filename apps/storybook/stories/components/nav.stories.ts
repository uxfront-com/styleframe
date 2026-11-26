import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Nav from "../../src/components/components/nav/Nav.vue";
import NavItem from "../../src/components/components/nav/NavItem.vue";
import NavGrid from "../../src/components/components/nav/preview/NavGrid.vue";
import NavSizeGrid from "../../src/components/components/nav/preview/NavSizeGrid.vue";

const sizes = ["sm", "md", "lg"] as const;
const orientations = ["horizontal", "vertical"] as const;

const meta = {
	title: "Theme/Recipes/Navigation/Nav",
	component: Nav,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: orientations,
			description: "The orientation of the nav",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size",
		},
	},
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		components: { Nav, NavItem },
		setup() {
			return { args };
		},
		template: `
			<Nav v-bind="args">
				<NavItem href="#">Home</NavItem>
				<NavItem href="#" active>About</NavItem>
				<NavItem href="#">Contact</NavItem>
				<NavItem href="#" disabled>Disabled</NavItem>
			</Nav>
		`,
	}),
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { NavGrid },
		template: "<NavGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { NavSizeGrid },
		template: "<NavSizeGrid />",
	}),
};

// Orientation stories

export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => ({
		components: { Nav, NavItem },
		setup() {
			return { args };
		},
		template: `
			<Nav v-bind="args">
				<NavItem href="#">Home</NavItem>
				<NavItem href="#" active>About</NavItem>
				<NavItem href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
	render: (args) => ({
		components: { Nav, NavItem },
		setup() {
			return { args };
		},
		template: `
			<Nav v-bind="args">
				<NavItem href="#">Home</NavItem>
				<NavItem href="#" active>About</NavItem>
				<NavItem href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

// Color stories

export const Light: Story = {
	render: () => ({
		components: { Nav, NavItem },
		template: `
			<Nav>
				<NavItem color="light" href="#">Home</NavItem>
				<NavItem color="light" href="#" active>About</NavItem>
				<NavItem color="light" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

export const Dark: Story = {
	render: () => ({
		components: { Nav, NavItem },
		template: `
			<Nav>
				<NavItem color="dark" href="#">Home</NavItem>
				<NavItem color="dark" href="#" active>About</NavItem>
				<NavItem color="dark" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

export const Neutral: Story = {
	render: () => ({
		components: { Nav, NavItem },
		template: `
			<Nav>
				<NavItem color="neutral" href="#">Home</NavItem>
				<NavItem color="neutral" href="#" active>About</NavItem>
				<NavItem color="neutral" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

// Variant stories

export const Ghost: Story = {
	render: () => ({
		components: { Nav, NavItem },
		template: `
			<Nav>
				<NavItem variant="ghost" href="#">Home</NavItem>
				<NavItem variant="ghost" href="#" active>About</NavItem>
				<NavItem variant="ghost" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

export const Link: Story = {
	render: () => ({
		components: { Nav, NavItem },
		template: `
			<Nav>
				<NavItem variant="link" href="#">Home</NavItem>
				<NavItem variant="link" href="#" active>About</NavItem>
				<NavItem variant="link" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

// Size stories

export const Small: Story = {
	args: {
		size: "sm",
	},
	render: (args) => ({
		components: { Nav, NavItem },
		setup() {
			return { args };
		},
		template: `
			<Nav v-bind="args">
				<NavItem size="sm" href="#">Home</NavItem>
				<NavItem size="sm" href="#" active>About</NavItem>
				<NavItem size="sm" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

export const Medium: Story = {
	args: {
		size: "md",
	},
	render: (args) => ({
		components: { Nav, NavItem },
		setup() {
			return { args };
		},
		template: `
			<Nav v-bind="args">
				<NavItem size="md" href="#">Home</NavItem>
				<NavItem size="md" href="#" active>About</NavItem>
				<NavItem size="md" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

export const Large: Story = {
	args: {
		size: "lg",
	},
	render: (args) => ({
		components: { Nav, NavItem },
		setup() {
			return { args };
		},
		template: `
			<Nav v-bind="args">
				<NavItem size="lg" href="#">Home</NavItem>
				<NavItem size="lg" href="#" active>About</NavItem>
				<NavItem size="lg" href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

// Feature stories

export const Active: Story = {
	render: () => ({
		components: { Nav, NavItem },
		template: `
			<Nav>
				<NavItem href="#">Home</NavItem>
				<NavItem href="#" active>Active Item</NavItem>
				<NavItem href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};

export const Disabled: Story = {
	render: () => ({
		components: { Nav, NavItem },
		template: `
			<Nav>
				<NavItem href="#">Home</NavItem>
				<NavItem href="#" disabled>Disabled Item</NavItem>
				<NavItem href="#">Contact</NavItem>
			</Nav>
		`,
	}),
};
