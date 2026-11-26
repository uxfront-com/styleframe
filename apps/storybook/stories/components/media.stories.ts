import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Media from "@/components/components/media/Media.vue";
import MediaBody from "@/components/components/media/MediaBody.vue";
import MediaFigure from "@/components/components/media/MediaFigure.vue";
import MediaTitle from "@/components/components/media/MediaTitle.vue";
import MediaGrid from "@/components/components/media/preview/MediaGrid.vue";
import MediaSizeGrid from "@/components/components/media/preview/MediaSizeGrid.vue";
import NestedMedia from "@/components/components/media/preview/NestedMedia.vue";

const orientations = ["horizontal", "vertical"] as const;
const aligns = ["start", "center", "end"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Layout/Media",
	component: Media,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: orientations,
			description: "The orientation of the media object",
		},
		align: {
			control: "select",
			options: aligns,
			description: "The cross-axis alignment of the figure relative to the body",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the media object",
		},
	},
	render: (args) => ({
		components: {
			Media,
			MediaFigure,
			MediaBody,
			MediaTitle,
		},
		setup() {
			return { args };
		},
		template: `
			<Media v-bind="args" class="_max-width:[360px]">
				<MediaFigure :size="args.size">
					<div class="media-avatar _width:[40px] _height:[40px]">MA</div>
				</MediaFigure>
				<MediaBody :size="args.size">
					<MediaTitle :size="args.size">Featured story</MediaTitle>
					<p class="_margin:0">A short body paragraph that follows the title in the media body.</p>
				</MediaBody>
			</Media>
		`,
	}),
} satisfies Meta<typeof Media>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		orientation: "horizontal",
		align: "start",
		size: "md",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { MediaGrid },
		template: "<MediaGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { MediaSizeGrid },
		template: "<MediaSizeGrid />",
	}),
};

export const Nested: StoryObj = {
	render: () => ({
		components: { NestedMedia },
		template: "<NestedMedia />",
	}),
};

// Orientation stories
export const Horizontal: Story = {
	args: {
		orientation: "horizontal",
	},
};

export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
};

// Align stories
export const AlignStart: Story = {
	args: {
		align: "start",
	},
};

export const AlignCenter: Story = {
	args: {
		align: "center",
	},
};

export const AlignEnd: Story = {
	args: {
		align: "end",
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
