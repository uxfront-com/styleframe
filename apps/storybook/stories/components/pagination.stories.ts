import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Pagination from "../../src/components/components/pagination/Pagination.vue";
import PaginationItem from "../../src/components/components/pagination/PaginationItem.vue";
import PaginationEllipsis from "../../src/components/components/pagination/PaginationEllipsis.vue";
import PaginationGrid from "../../src/components/components/pagination/preview/PaginationGrid.vue";
import PaginationSizeGrid from "../../src/components/components/pagination/preview/PaginationSizeGrid.vue";

const sizes = ["sm", "md", "lg"] as const;
const orientations = ["horizontal", "vertical"] as const;

const meta = {
	title: "Theme/Recipes/Navigation/Pagination",
	component: Pagination,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: orientations,
			description: "The orientation of the pagination",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size",
		},
	},
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		setup() {
			return { args };
		},
		template: `
			<Pagination v-bind="args">
				<PaginationItem href="#" aria-label="Previous page">‹</PaginationItem>
				<PaginationItem href="#">1</PaginationItem>
				<PaginationItem href="#" active>2</PaginationItem>
				<PaginationItem href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem href="#">9</PaginationItem>
				<PaginationItem href="#" aria-label="Next page">›</PaginationItem>
			</Pagination>
		`,
	}),
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { PaginationGrid },
		template: "<PaginationGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { PaginationSizeGrid },
		template: "<PaginationSizeGrid />",
	}),
};

// Orientation stories

export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		setup() {
			return { args };
		},
		template: `
			<Pagination v-bind="args">
				<PaginationItem href="#">1</PaginationItem>
				<PaginationItem href="#" active>2</PaginationItem>
				<PaginationItem href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
	render: (args) => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		setup() {
			return { args };
		},
		template: `
			<Pagination v-bind="args">
				<PaginationItem href="#">1</PaginationItem>
				<PaginationItem href="#" active>2</PaginationItem>
				<PaginationItem href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

// Color stories

export const Light: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem color="light" href="#">1</PaginationItem>
				<PaginationItem color="light" href="#" active>2</PaginationItem>
				<PaginationItem color="light" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem color="light" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Dark: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem color="dark" href="#">1</PaginationItem>
				<PaginationItem color="dark" href="#" active>2</PaginationItem>
				<PaginationItem color="dark" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem color="dark" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Neutral: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem color="neutral" href="#">1</PaginationItem>
				<PaginationItem color="neutral" href="#" active>2</PaginationItem>
				<PaginationItem color="neutral" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem color="neutral" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

// Variant stories

export const Solid: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem variant="solid" href="#">1</PaginationItem>
				<PaginationItem variant="solid" href="#" active>2</PaginationItem>
				<PaginationItem variant="solid" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem variant="solid" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Outline: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem variant="outline" href="#">1</PaginationItem>
				<PaginationItem variant="outline" href="#" active>2</PaginationItem>
				<PaginationItem variant="outline" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem variant="outline" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Soft: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem variant="soft" href="#">1</PaginationItem>
				<PaginationItem variant="soft" href="#" active>2</PaginationItem>
				<PaginationItem variant="soft" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem variant="soft" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Subtle: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem variant="subtle" href="#">1</PaginationItem>
				<PaginationItem variant="subtle" href="#" active>2</PaginationItem>
				<PaginationItem variant="subtle" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem variant="subtle" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Ghost: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem variant="ghost" href="#">1</PaginationItem>
				<PaginationItem variant="ghost" href="#" active>2</PaginationItem>
				<PaginationItem variant="ghost" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem variant="ghost" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Link: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem variant="link" href="#">1</PaginationItem>
				<PaginationItem variant="link" href="#" active>2</PaginationItem>
				<PaginationItem variant="link" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem variant="link" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

// Size stories

export const Small: Story = {
	args: {
		size: "sm",
	},
	render: (args) => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		setup() {
			return { args };
		},
		template: `
			<Pagination v-bind="args">
				<PaginationItem size="sm" href="#">1</PaginationItem>
				<PaginationItem size="sm" href="#" active>2</PaginationItem>
				<PaginationItem size="sm" href="#">3</PaginationItem>
				<PaginationEllipsis size="sm" />
				<PaginationItem size="sm" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Medium: Story = {
	args: {
		size: "md",
	},
	render: (args) => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		setup() {
			return { args };
		},
		template: `
			<Pagination v-bind="args">
				<PaginationItem size="md" href="#">1</PaginationItem>
				<PaginationItem size="md" href="#" active>2</PaginationItem>
				<PaginationItem size="md" href="#">3</PaginationItem>
				<PaginationEllipsis size="md" />
				<PaginationItem size="md" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Large: Story = {
	args: {
		size: "lg",
	},
	render: (args) => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		setup() {
			return { args };
		},
		template: `
			<Pagination v-bind="args">
				<PaginationItem size="lg" href="#">1</PaginationItem>
				<PaginationItem size="lg" href="#" active>2</PaginationItem>
				<PaginationItem size="lg" href="#">3</PaginationItem>
				<PaginationEllipsis size="lg" />
				<PaginationItem size="lg" href="#">9</PaginationItem>
			</Pagination>
		`,
	}),
};

// Feature stories

export const WithControls: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem href="#" aria-label="First page">«</PaginationItem>
				<PaginationItem href="#" aria-label="Previous page">‹</PaginationItem>
				<PaginationItem href="#">1</PaginationItem>
				<PaginationItem href="#" active>2</PaginationItem>
				<PaginationItem href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem href="#">9</PaginationItem>
				<PaginationItem href="#" aria-label="Next page">›</PaginationItem>
				<PaginationItem href="#" aria-label="Last page">»</PaginationItem>
			</Pagination>
		`,
	}),
};

export const Disabled: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem href="#" aria-label="Previous page" disabled>‹</PaginationItem>
				<PaginationItem href="#" active>1</PaginationItem>
				<PaginationItem href="#">2</PaginationItem>
				<PaginationItem href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem href="#">9</PaginationItem>
				<PaginationItem href="#" aria-label="Next page">›</PaginationItem>
			</Pagination>
		`,
	}),
};

export const ActiveSolidContrast: Story = {
	render: () => ({
		components: { Pagination, PaginationItem, PaginationEllipsis },
		template: `
			<Pagination>
				<PaginationItem href="#" aria-label="Previous page">‹</PaginationItem>
				<PaginationItem variant="ghost" href="#">1</PaginationItem>
				<PaginationItem variant="solid" href="#" active>2</PaginationItem>
				<PaginationItem variant="ghost" href="#">3</PaginationItem>
				<PaginationEllipsis />
				<PaginationItem variant="ghost" href="#">9</PaginationItem>
				<PaginationItem href="#" aria-label="Next page">›</PaginationItem>
			</Pagination>
		`,
	}),
};
