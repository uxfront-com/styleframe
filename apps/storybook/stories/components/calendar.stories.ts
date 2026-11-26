import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Calendar from "../../src/components/components/calendar/Calendar.vue";
import CalendarSizeGrid from "../../src/components/components/calendar/preview/CalendarSizeGrid.vue";
import CalendarStatesGrid from "../../src/components/components/calendar/preview/CalendarStatesGrid.vue";
import CalendarVariantsGrid from "../../src/components/components/calendar/preview/CalendarVariantsGrid.vue";

const sizes = ["sm", "md", "lg"] as const;
const variants = ["solid", "outline", "soft", "subtle"] as const;

const meta = {
	title: "Theme/Recipes/Forms/Calendar",
	component: Calendar,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		type: {
			control: "select",
			options: ["day", "month", "year"],
			description: "Picker view: a day grid, a month grid, or a year grid",
		},
		size: {
			control: "select",
			options: sizes,
			description: "Cell size and density (sets --calendar-cell-size)",
		},
		variant: {
			control: "select",
			options: variants,
			description: "Active-selection style for selected days and range endpoints",
		},
		numberOfMonths: {
			control: "number",
			description: "How many consecutive months to render side by side",
		},
		weekNumbers: {
			control: "boolean",
			description: "Show the leading ISO week-number column",
		},
		dropdownCaption: {
			control: "boolean",
			description: "Swap the month/year label for select dropdowns",
		},
		presets: {
			control: "boolean",
			description: "Show the quick-pick presets sidebar",
		},
		time: {
			control: "boolean",
			description: "Show the start/end time-picker footer",
		},
	},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { selected: "2026-06-18" },
};

export const AllStates: StoryObj = {
	render: () => ({
		components: { CalendarStatesGrid },
		template: "<CalendarStatesGrid />",
	}),
};

export const AllSizes: StoryObj = {
	render: () => ({
		components: { CalendarSizeGrid },
		template: "<CalendarSizeGrid />",
	}),
};

export const AllVariants: StoryObj = {
	render: () => ({
		components: { CalendarVariantsGrid },
		template: "<CalendarVariantsGrid />",
	}),
};

export const Outline: Story = {
	args: {
		variant: "outline",
		selected: "2026-06-18",
		rangeStart: "2026-06-08",
		rangeEnd: "2026-06-12",
	},
};

export const Soft: Story = {
	args: {
		variant: "soft",
		selected: "2026-06-18",
		rangeStart: "2026-06-08",
		rangeEnd: "2026-06-12",
	},
};

export const Subtle: Story = {
	args: {
		variant: "subtle",
		selected: "2026-06-18",
		rangeStart: "2026-06-08",
		rangeEnd: "2026-06-12",
	},
};

export const Range: Story = {
	args: {
		rangeStart: "2026-06-08",
		rangeEnd: "2026-06-15",
	},
};

export const RangeTwoMonths: Story = {
	args: {
		numberOfMonths: 2,
		rangeStart: "2026-06-25",
		rangeEnd: "2026-07-05",
	},
};

export const MonthPicker: Story = {
	args: { type: "month", selected: "2026-02-10" },
};

export const YearPicker: Story = {
	args: { type: "year", selected: "2022-06-18" },
};

export const MonthYearDropdown: Story = {
	args: { dropdownCaption: true, selected: "2026-06-18" },
};

export const Presets: Story = {
	args: { presets: true, rangeStart: "2026-06-05", rangeEnd: "2026-06-11" },
};

export const DateTime: Story = {
	args: { time: true, selected: "2026-06-18" },
};

export const BookedDates: Story = {
	args: {
		selected: "2026-06-18",
		booked: ["2026-06-04", "2026-06-05", "2026-06-12", "2026-06-19", "2026-06-26"],
		disabledDays: ["2026-06-01", "2026-06-02"],
	},
};

export const WeekNumbers: Story = {
	args: { weekNumbers: true, selected: "2026-06-18" },
};

export const CustomCellSize: StoryObj = {
	render: () => ({
		components: { Calendar },
		setup() {
			const prices: Record<string, string> = {};
			for (let day = 1; day <= 30; day++) {
				const iso = `2026-06-${String(day).padStart(2, "0")}`;
				prices[iso] = `$${90 + ((day * 7) % 60)}`;
			}
			return { prices };
		},
		template: `
			<Calendar
				class="calendar-cell-size-lg"
				size="lg"
				selected="2026-06-18"
				:booked="['2026-06-12', '2026-06-13', '2026-06-20']"
				:prices="prices"
			/>
		`,
	}),
};
