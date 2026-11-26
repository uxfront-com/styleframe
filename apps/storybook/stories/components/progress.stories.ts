import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ProgressGrid from "../../src/components/components/progress/preview/ProgressGrid.vue";
import ProgressSizeGrid from "../../src/components/components/progress/preview/ProgressSizeGrid.vue";
import Progress from "../../src/components/components/progress/Progress.vue";
import ProgressBar from "../../src/components/components/progress/ProgressBar.vue";

const colors = [
	"primary",
	"secondary",
	"success",
	"info",
	"warning",
	"error",
	"light",
	"dark",
	"neutral",
] as const;
const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
const animations = ["none", "carousel", "carousel-inverse", "swing", "elastic"] as const;

const meta = {
	title: "Theme/Recipes/Feedback/Progress",
	component: Progress,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color of the progress bar fill",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size (height) of the progress bar",
		},
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
			description: "The orientation of the progress bar",
		},
		inverted: {
			control: "boolean",
			description: "Whether the fill direction is inverted",
		},
		animation: {
			control: "select",
			options: animations,
			description: "The animation style for indeterminate state (value=null)",
		},
		value: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "The progress value (0-100). Set to null for indeterminate.",
		},
	},
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: 65,
	},
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress :size="args.size" :orientation="args.orientation" :value="args.value">
				<ProgressBar :color="args.color" :size="args.size" :orientation="args.orientation" :inverted="args.inverted" :animation="args.animation" :value="args.value" />
			</Progress>
		`,
	}),
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { ProgressGrid },
		template: "<ProgressGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { ProgressSizeGrid },
		template: "<ProgressSizeGrid />",
	}),
};

export const Indeterminate: StoryObj = {
	render: () => ({
		components: { Progress, ProgressBar },
		template: `
			<div class="_display:flex _flex-direction:column _gap:1.5">
				<div>
					<div class="_margin-bottom:0.5 _font-weight:semibold">Carousel</div>
					<Progress>
						<ProgressBar :value="null" animation="carousel" />
					</Progress>
				</div>
				<div>
					<div class="_margin-bottom:0.5 _font-weight:semibold">Carousel Inverse</div>
					<Progress>
						<ProgressBar :value="null" animation="carousel-inverse" />
					</Progress>
				</div>
				<div>
					<div class="_margin-bottom:0.5 _font-weight:semibold">Swing</div>
					<Progress>
						<ProgressBar :value="null" animation="swing" />
					</Progress>
				</div>
				<div>
					<div class="_margin-bottom:0.5 _font-weight:semibold">Elastic</div>
					<Progress>
						<ProgressBar :value="null" animation="elastic" />
					</Progress>
				</div>
			</div>
		`,
	}),
};

export const Vertical: StoryObj = {
	render: () => ({
		components: { Progress, ProgressBar },
		template: `
			<div class="_display:flex _gap:1.5 _height:[200px]">
				<Progress orientation="vertical" :value="65">
					<ProgressBar color="primary" orientation="vertical" :value="65" />
				</Progress>
				<Progress orientation="vertical" :value="40">
					<ProgressBar color="secondary" orientation="vertical" :value="40" />
				</Progress>
				<Progress orientation="vertical" :value="80">
					<ProgressBar color="success" orientation="vertical" :value="80" />
				</Progress>
				<Progress orientation="vertical" :value="25">
					<ProgressBar color="warning" orientation="vertical" :value="25" />
				</Progress>
				<Progress orientation="vertical" :value="55">
					<ProgressBar color="error" orientation="vertical" :value="55" />
				</Progress>
			</div>
		`,
	}),
};

export const Inverted: StoryObj = {
	render: () => ({
		components: { Progress, ProgressBar },
		template: `
			<div class="_display:flex _flex-direction:column _gap:1.5">
				<div>
					<div class="_margin-bottom:0.5 _font-weight:600">Normal (left to right)</div>
					<Progress :value="65">
						<ProgressBar :value="65" />
					</Progress>
				</div>
				<div>
					<div class="_margin-bottom:0.5 _font-weight:600">Inverted (right to left)</div>
					<Progress :value="65">
						<ProgressBar :value="65" :inverted="true" />
					</Progress>
				</div>
				<div class="_display:flex _gap:1.5">
					<div>
						<div class="_margin-bottom:0.5 _font-weight:600">Vertical (bottom to top)</div>
						<div class="_display:flex _height:[180px]">
							<Progress orientation="vertical" :value="65">
								<ProgressBar orientation="vertical" :value="65" />
							</Progress>
						</div>
					</div>
					<div>
						<div class="_margin-bottom:0.5 _font-weight:600">Vertical Inverted (top to bottom)</div>
						<div class="_display:flex _height:[180px]">
							<Progress orientation="vertical" :value="65">
								<ProgressBar orientation="vertical" :value="65" :inverted="true" />
							</Progress>
						</div>
					</div>
				</div>
			</div>
		`,
	}),
};

export const IndeterminateVertical: StoryObj = {
	render: () => ({
		components: { Progress, ProgressBar },
		template: `
			<div class="_display:flex _gap:1.5 _height:[200px]">
				<Progress orientation="vertical">
					<ProgressBar orientation="vertical" :value="null" animation="carousel" />
				</Progress>
				<Progress orientation="vertical">
					<ProgressBar orientation="vertical" :value="null" animation="carousel-inverse" />
				</Progress>
				<Progress orientation="vertical">
					<ProgressBar orientation="vertical" :value="null" animation="swing" />
				</Progress>
				<Progress orientation="vertical">
					<ProgressBar orientation="vertical" :value="null" animation="elastic" />
				</Progress>
			</div>
		`,
	}),
};

// Individual color stories
export const Primary: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress :value="args.value">
				<ProgressBar color="primary" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Secondary: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress :value="args.value">
				<ProgressBar color="secondary" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Success: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress :value="args.value">
				<ProgressBar color="success" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Info: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress :value="args.value">
				<ProgressBar color="info" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Warning: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress :value="args.value">
				<ProgressBar color="warning" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Error: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress :value="args.value">
				<ProgressBar color="error" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Light: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress color="light" :value="args.value">
				<ProgressBar color="light" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Dark: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress color="dark" :value="args.value">
				<ProgressBar color="dark" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Neutral: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress color="neutral" :value="args.value">
				<ProgressBar color="neutral" :value="args.value" />
			</Progress>
		`,
	}),
};

// Size stories
export const ExtraSmall: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress size="xs" :value="args.value">
				<ProgressBar size="xs" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Small: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress size="sm" :value="args.value">
				<ProgressBar size="sm" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Medium: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress size="md" :value="args.value">
				<ProgressBar size="md" :value="args.value" />
			</Progress>
		`,
	}),
};

export const Large: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress size="lg" :value="args.value">
				<ProgressBar size="lg" :value="args.value" />
			</Progress>
		`,
	}),
};

export const ExtraLarge: Story = {
	args: { value: 65 },
	render: (args) => ({
		components: { Progress, ProgressBar },
		setup() {
			return { args };
		},
		template: `
			<Progress size="xl" :value="args.value">
				<ProgressBar size="xl" :value="args.value" />
			</Progress>
		`,
	}),
};
