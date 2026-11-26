import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Avatar from "@/components/components/avatar/Avatar.vue";
import AvatarGroup from "@/components/components/avatar/AvatarGroup.vue";
import AvatarGroupGrid from "@/components/components/avatar/preview/AvatarGroupGrid.vue";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
	title: "Theme/Recipes/Layout/Avatar Group",
	component: AvatarGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		size: {
			control: "select",
			options: sizes,
			description: "The avatar size for the stack (also controls the overlap)",
		},
		count: {
			control: "number",
			description: "Optional overflow count, rendered as a trailing +N avatar",
		},
	},
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		components: { AvatarGroup, Avatar },
		setup() {
			return { args };
		},
		template: `
			<AvatarGroup v-bind="args">
				<Avatar :size="args.size" src="https://i.pravatar.cc/120?img=1" alt="Team member" label="AB" />
				<Avatar :size="args.size" src="https://i.pravatar.cc/120?img=2" alt="Team member" label="CD" />
				<Avatar :size="args.size" src="https://i.pravatar.cc/120?img=3" alt="Team member" label="EF" />
				<Avatar :size="args.size" src="https://i.pravatar.cc/120?img=4" alt="Team member" label="GH" />
			</AvatarGroup>
		`,
	}),
	args: {
		size: "md",
	},
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { AvatarGroupGrid },
		template: "<AvatarGroupGrid />",
	}),
};

export const WithOverflowCount: Story = {
	render: (args) => ({
		components: { AvatarGroup, Avatar },
		setup() {
			return { args };
		},
		template: `
			<AvatarGroup v-bind="args">
				<Avatar :size="args.size" src="https://i.pravatar.cc/120?img=5" alt="Team member" label="AB" />
				<Avatar :size="args.size" src="https://i.pravatar.cc/120?img=6" alt="Team member" label="CD" />
				<Avatar :size="args.size" src="https://i.pravatar.cc/120?img=7" alt="Team member" label="EF" />
			</AvatarGroup>
		`,
	}),
	args: {
		size: "md",
		count: 3,
	},
};
