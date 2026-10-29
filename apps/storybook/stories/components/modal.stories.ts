import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Button from "@/components/components/button/Button.vue";
import Modal from "@/components/components/modal/Modal.vue";
import ModalOverlay from "@/components/components/modal/ModalOverlay.vue";
import ModalHeader from "@/components/components/modal/ModalHeader.vue";
import ModalBody from "@/components/components/modal/ModalBody.vue";
import ModalFooter from "@/components/components/modal/ModalFooter.vue";
import ModalTitle from "@/components/components/modal/ModalTitle.vue";
import ModalDescription from "@/components/components/modal/ModalDescription.vue";
import ModalGrid from "@/components/components/modal/preview/ModalGrid.vue";
import ModalSizeGrid from "@/components/components/modal/preview/ModalSizeGrid.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;
const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Theme/Recipes/Overlays/Modal",
	component: Modal,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		// The open overlay is fixed and stops the page scrolling, so each
		// story renders in its own frame on the docs page.
		docs: {
			story: {
				inline: false,
				iframeHeight: 480,
			},
		},
	},
	argTypes: {
		color: {
			control: "select",
			options: colors,
			description: "The color variant of the modal",
		},
		variant: {
			control: "select",
			options: variants,
			description: "The visual style variant",
		},
		size: {
			control: "select",
			options: sizes,
			description: "The size of the modal",
		},
		fullscreen: {
			control: "boolean",
			description: "Fill the viewport and square the corners",
		},
	},
	render: (args) => ({
		components: {
			Button,
			Modal,
			ModalOverlay,
			ModalHeader,
			ModalBody,
			ModalFooter,
			ModalTitle,
			ModalDescription,
		},
		setup() {
			const isOpen = ref(true);
			return { args, isOpen };
		},
		template: `
			<Button label="Open Modal" @click="isOpen = true" />
			<ModalOverlay v-if="isOpen" @click.self="isOpen = false">
				<Modal v-bind="args" aria-modal="true" aria-labelledby="modal-title">
					<ModalHeader v-bind="args">
						<ModalTitle id="modal-title">Modal Title</ModalTitle>
					</ModalHeader>
					<ModalBody v-bind="args">
						<ModalDescription>This is a modal description with some content.</ModalDescription>
					</ModalBody>
					<ModalFooter v-bind="args">
						<Button label="Close" v-bind="args" @click="isOpen = false" />
					</ModalFooter>
				</Modal>
			</ModalOverlay>
		`,
	}),
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
	},
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { ModalGrid },
		template: "<ModalGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { ModalSizeGrid },
		template: "<ModalSizeGrid />",
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

// Fullscreen story
export const Fullscreen: Story = {
	render: (args) => ({
		components: {
			Button,
			Modal,
			ModalOverlay,
			ModalHeader,
			ModalBody,
			ModalFooter,
			ModalTitle,
			ModalDescription,
		},
		setup() {
			const isOpen = ref(true);
			return { args, isOpen };
		},
		template: `
			<Button label="Open Fullscreen Modal" @click="isOpen = true" />
			<ModalOverlay v-if="isOpen">
				<Modal
					v-bind="args"
					:fullscreen="true"
					aria-modal="true"
					aria-labelledby="modal-fullscreen-title"
				>
					<ModalHeader v-bind="args">
						<ModalTitle id="modal-fullscreen-title">Fullscreen Modal</ModalTitle>
					</ModalHeader>
					<ModalBody v-bind="args" :fullscreen="true">
						<ModalDescription>This modal takes up the entire viewport.</ModalDescription>
					</ModalBody>
					<ModalFooter v-bind="args">
						<Button label="Close" variant="outline" color="neutral" @click="isOpen = false" />
					</ModalFooter>
				</Modal>
			</ModalOverlay>
		`,
	}),
	args: {
		color: "neutral",
		variant: "solid",
		size: "lg",
	},
};

const modalComponents = {
	Button,
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalTitle,
	ModalDescription,
};

// Focus story: the Close button takes focus, so the harness can check the
// focus ring inside an open modal.
export const Focus: Story = {
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
	},
	play: ({ canvasElement }) => {
		canvasElement.querySelector<HTMLButtonElement>(".modal button")?.focus();
	},
};

// Long content: the panel stops short of the screen's edges, and only the body
// scrolls, so the title and the actions stay in view.
export const LongContent: Story = {
	render: (args) => ({
		components: modalComponents,
		setup() {
			const paragraphs = Array.from({ length: 30 }, (_, index) => index + 1);
			return { args, paragraphs };
		},
		template: `
			<ModalOverlay>
				<Modal v-bind="args" aria-modal="true" aria-labelledby="modal-long-title">
					<ModalHeader v-bind="args">
						<ModalTitle id="modal-long-title">Terms of service</ModalTitle>
					</ModalHeader>
					<ModalBody v-bind="args" tabindex="0" role="region" aria-label="Terms">
						<ModalDescription v-for="paragraph in paragraphs" :key="paragraph">
							Paragraph {{ paragraph }} of the terms, long enough to need scrolling.
						</ModalDescription>
					</ModalBody>
					<ModalFooter v-bind="args">
						<Button label="Decline" variant="outline" color="neutral" />
						<Button label="Accept" />
					</ModalFooter>
				</Modal>
			</ModalOverlay>
		`,
	}),
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
	},
};

// Long title: the title wraps rather than getting cut off.
export const LongTitle: Story = {
	render: (args) => ({
		components: modalComponents,
		setup() {
			return { args };
		},
		template: `
			<ModalOverlay>
				<Modal v-bind="args" aria-modal="true" aria-labelledby="modal-wrap-title">
					<ModalHeader v-bind="args">
						<ModalTitle id="modal-wrap-title">Delete the project and every file, comment and setting that belongs to it?</ModalTitle>
					</ModalHeader>
					<ModalBody v-bind="args">
						<ModalDescription>This can't be undone.</ModalDescription>
					</ModalBody>
					<ModalFooter v-bind="args">
						<Button label="Keep project" variant="outline" color="neutral" />
						<Button label="Delete project" color="error" />
					</ModalFooter>
				</Modal>
			</ModalOverlay>
		`,
	}),
	args: {
		color: "neutral",
		variant: "solid",
		size: "sm",
	},
};

// Right to left: the padding and the actions mirror.
export const RightToLeft: Story = {
	render: (args) => ({
		components: modalComponents,
		setup() {
			return { args };
		},
		template: `
			<ModalOverlay dir="rtl" lang="ar">
				<Modal v-bind="args" aria-modal="true" aria-labelledby="modal-rtl-title">
					<ModalHeader v-bind="args">
						<ModalTitle id="modal-rtl-title">حذف المشروع؟</ModalTitle>
					</ModalHeader>
					<ModalBody v-bind="args">
						<ModalDescription>لا يمكن التراجع عن هذا الإجراء.</ModalDescription>
					</ModalBody>
					<ModalFooter v-bind="args">
						<Button label="إلغاء" variant="outline" color="neutral" />
						<Button label="حذف" color="error" />
					</ModalFooter>
				</Modal>
			</ModalOverlay>
		`,
	}),
	args: {
		color: "neutral",
		variant: "solid",
		size: "md",
	},
};
