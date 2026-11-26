import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Button from "../../src/components/components/button/Button.vue";
import ToastGrid from "../../src/components/components/toast/preview/ToastGrid.vue";
import ToastOrientationGrid from "../../src/components/components/toast/preview/ToastOrientationGrid.vue";
import ToastSizeGrid from "../../src/components/components/toast/preview/ToastSizeGrid.vue";
import Toast from "../../src/components/components/toast/Toast.vue";

const colors = [
	"neutral",
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"light",
	"dark",
] as const;
const variants = ["solid", "soft", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;
const orientations = ["horizontal", "vertical"] as const;

const meta = {
	title: "Theme/Recipes/Feedback/Toast",
	component: Toast,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description:
				"The semantic accent. Scoped to the icon and progress bar — the body stays neutral for every color.",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The neutral surface treatment (solid / soft / subtle)",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the toast",
		},
		orientation: {
			control: "select",
			options: orientations,
			description: "The layout direction of the toast",
		},
		title: {
			control: "text",
			description: "The title text of the toast",
		},
		description: {
			control: "text",
			description: "The description text of the toast",
		},
		icon: {
			control: "text",
			description: "The name of the icon to display (optional)",
		},
		dismissible: {
			control: "boolean",
			description: "Whether the toast can be dismissed",
		},
		progress: {
			control: "boolean",
			description: "Whether to show the duration progress line pinned to the bottom edge",
		},
	},
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	// No explicit `variant` — renders the recipe default (`solid`).
	args: {
		color: "neutral",
		size: "md",
		orientation: "horizontal",
		title: "Toast",
		description: "This is a toast description.",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { ToastGrid },
		template: "<ToastGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { ToastSizeGrid },
		template: "<ToastSizeGrid />",
	}),
};

export const AllOrientations: StoryObj = {
	render: () => ({
		components: { ToastOrientationGrid },
		template: "<ToastOrientationGrid />",
	}),
};

export const Dismissible: Story = {
	args: {
		color: "info",
		dismissible: true,
		title: "Dismissible Toast",
		description: "Click the dismiss button to hide this toast.",
	},
	render: (args) => ({
		components: { Toast, Button },
		setup() {
			const dismissed = ref(false);
			return { args, dismissed };
		},
		template: `
			<Toast v-bind="args" :hidden="dismissed" @dismiss="dismissed = true" />
			<Button v-if="dismissed" label="Reset" @click="dismissed = false" />
		`,
	}),
};

export const WithProgress: Story = {
	args: {
		color: "success",
		icon: "✓",
		progress: true,
		title: "Changes saved",
		description: "Your edits are live. The bar tracks the auto-dismiss countdown.",
	},
	render: (args) => ({
		components: { Toast },
		setup() {
			return { args };
		},
		// `.toast-progress-demo` loops the bar so the countdown stays visible on
		// the static canvas; real usage runs it once over `--toast-duration`.
		template: `
			<div class="toast-progress-demo">
				<Toast v-bind="args" />
			</div>
		`,
	}),
};

// Individual color stories. Each shows an icon so the color axis is visible —
// the accent lands on the icon (and progress bar), never the neutral body.
export const Neutral: Story = {
	args: {
		color: "neutral",
		icon: "●",
		title: "Neutral Toast",
		description: "This is a neutral toast.",
	},
};

export const Primary: Story = {
	args: {
		color: "primary",
		icon: "●",
		title: "Primary Toast",
		description: "This is a primary toast.",
	},
};

export const Secondary: Story = {
	args: {
		color: "secondary",
		icon: "●",
		title: "Secondary Toast",
		description: "This is a secondary toast.",
	},
};

export const Success: Story = {
	args: {
		color: "success",
		icon: "●",
		title: "Success Toast",
		description: "This is a success toast.",
	},
};

export const Info: Story = {
	args: {
		color: "info",
		icon: "●",
		title: "Info Toast",
		description: "This is an info toast.",
	},
};

export const Warning: Story = {
	args: {
		color: "warning",
		icon: "●",
		title: "Warning Toast",
		description: "This is a warning toast.",
	},
};

export const Error: Story = {
	args: {
		color: "error",
		icon: "●",
		title: "Error Toast",
		description: "This is an error toast.",
	},
};

export const Light: Story = {
	args: {
		color: "light",
		icon: "●",
		title: "Light Toast",
		description: "This is a light toast.",
	},
};

export const Dark: Story = {
	args: {
		color: "dark",
		icon: "●",
		title: "Dark Toast",
		description: "This is a dark toast.",
	},
};

// Variant stories
export const Solid: Story = {
	args: {
		variant: "solid",
		title: "Solid Toast",
		description: "This is a solid toast.",
	},
};

export const Soft: Story = {
	args: {
		variant: "soft",
		title: "Soft Toast",
		description: "This is a soft toast.",
	},
};

export const Subtle: Story = {
	args: {
		variant: "subtle",
		title: "Subtle Toast",
		description: "This is a subtle toast.",
	},
};

// Size stories
export const Small: Story = {
	args: {
		size: "sm",
		title: "Small Toast",
		description: "This is a small toast.",
	},
};

export const Medium: Story = {
	args: {
		size: "md",
		title: "Medium Toast",
		description: "This is a medium toast.",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		title: "Large Toast",
		description: "This is a large toast.",
	},
};

// Orientation stories
export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
		title: "Horizontal Toast",
		description: "This toast is oriented horizontally.",
	},
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
		title: "Vertical Toast",
		description: "This toast is oriented vertically.",
	},
};
