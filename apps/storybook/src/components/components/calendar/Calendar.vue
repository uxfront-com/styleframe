<script setup lang="ts">
import { computed } from "vue";
import { calendar, button } from "virtual:styleframe";
import CalendarDay from "./CalendarDay.vue";
import Input from "../input/Input.vue";

/**
 * A static calendar that demonstrates the calendar recipe's styling. Date logic is
 * deliberately minimal — the recipe styles parts and states; a real calendar wires
 * these classes to react-day-picker or `@internationalized/date`. Dates are ISO
 * strings (`2026-06-18`) so ranges can span the side-by-side months rendered by
 * `numberOfMonths`.
 */
const props = withDefaults(
	defineProps<{
		type?: "day" | "month" | "year";
		size?: "sm" | "md" | "lg";
		variant?: "solid" | "outline" | "soft" | "subtle";
		month?: number; // 0-indexed first visible month
		year?: number;
		numberOfMonths?: number;
		today?: string;
		selected?: string;
		rangeStart?: string;
		rangeEnd?: string;
		booked?: Array<string>;
		disabledDays?: Array<string>;
		prices?: Record<string, string>;
		weekNumbers?: boolean;
		dropdownCaption?: boolean;
		presets?: boolean;
		time?: boolean;
	}>(),
	{
		type: "day",
		size: "md",
		month: 5, // June
		year: 2026,
		numberOfMonths: 1,
		today: "2026-06-11",
		booked: () => [],
		disabledDays: () => [],
		prices: () => ({}),
	},
);

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const monthLabels = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const presetLabels = ["Today", "Yesterday", "Last 7 days", "Last 30 days"];

const controlSize = computed(() => (props.size === "sm" ? "sm" : "md"));

// Side-by-side months each show exactly one month: outside days from adjacent
// months would duplicate across the grids, so they render as invisible spacers.
const hideOutside = computed(() => props.numberOfMonths > 1);

function toIso(date: Date): string {
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${m}-${d}`;
}

type Cell = { day: number; outside: boolean; iso: string };
type Month = { month: number; year: number; label: string; weeks: Array<Array<Cell>> };

const months = computed<Array<Month>>(() =>
	Array.from({ length: props.numberOfMonths }, (_, offset) => {
		const first = new Date(props.year, props.month + offset, 1);
		const month = first.getMonth();
		const year = first.getFullYear();
		const startDow = first.getDay();

		const cells: Array<Cell> = Array.from({ length: 42 }, (_, i) => {
			const date = new Date(year, month, 1 - startDow + i);
			return {
				day: date.getDate(),
				outside: date.getMonth() !== month,
				iso: toIso(date),
			};
		});
		const weeks: Array<Array<Cell>> = [];
		for (let i = 0; i < cells.length; i += 7) {
			const week = cells.slice(i, i + 7);
			// Drop trailing filler weeks that contain no day of this month.
			if (week.every((c) => c.outside)) {continue;}
			weeks.push(week);
		}

		return { month, year, label: `${monthNames[month]} ${year}`, weeks };
	}),
);

// Month / year picker views: 12 periods per page; a period is "selected" or
// "today" when the corresponding ISO date prop falls inside it.
const yearStart = computed(() => props.year - (props.year % 12));
const years = computed(() =>
	Array.from({ length: 12 }, (_, i) => yearStart.value + i),
);

function isoMonth(year: number, month: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function inMonth(
	iso: string | undefined,
	year: number,
	month: number,
): boolean {
	return iso?.startsWith(isoMonth(year, month)) ?? false;
}

function inYear(iso: string | undefined, year: number): boolean {
	return iso?.startsWith(`${year}-`) ?? false;
}

function captionFor(m: Month): string {
	if (props.type === "month") {return String(m.year);}
	if (props.type === "year")
		{return `${yearStart.value} – ${yearStart.value + 11}`;}
	return m.label;
}

// ISO strings compare lexicographically in date order.
function rangeOf(cell: Cell): "none" | "start" | "middle" | "end" {
	if (cell.outside || !props.rangeStart || !props.rangeEnd) {return "none";}
	if (cell.iso === props.rangeStart) {return "start";}
	if (cell.iso === props.rangeEnd) {return "end";}
	if (cell.iso > props.rangeStart && cell.iso < props.rangeEnd) {return "middle";}
	return "none";
}

function weekNumber(row: Array<Cell>): number {
	const cell = row.find((c) => !c.outside) ?? row[0];
	const [y, m, d] = cell.iso.split("-").map(Number);
	const date = new Date(y, m - 1, d);
	const start = new Date(y, 0, 1);
	const days = Math.round((date.getTime() - start.getTime()) / 86_400_000);
	return Math.ceil((days + start.getDay() + 1) / 7);
}
</script>

<template>
	<div :class="calendar({ size: props.size })">
		<div class="calendar-body">
			<div v-if="props.presets" class="calendar-presets">
				<button
					v-for="(label, i) in presetLabels"
					:key="label"
					:class="button({ variant: 'ghost', size: controlSize })"
					:aria-pressed="i === 0 ? 'true' : 'false'"
				>
					{{ label }}
				</button>
			</div>

			<div class="calendar-months">
				<div v-for="(m, mi) in months" :key="m.label" class="calendar-month">
					<div class="calendar-caption">
						<div class="calendar-nav">
							<button
								v-if="mi === 0"
								:class="button({ variant: 'ghost', size: controlSize })"
								aria-label="Previous month"
							>
								‹
							</button>
						</div>

						<div v-if="props.dropdownCaption" class="calendar-caption-dropdowns">
							<select aria-label="Month">
								<option v-for="(name, i) in monthNames" :key="name" :selected="i === m.month">
									{{ name }}
								</option>
							</select>
							<select aria-label="Year">
								<option v-for="y in [2025, 2026, 2027]" :key="y" :selected="y === m.year">
									{{ y }}
								</option>
							</select>
						</div>
						<div v-else class="calendar-caption-label">{{ captionFor(m) }}</div>

						<div class="calendar-nav">
							<button
								v-if="mi === months.length - 1"
								:class="button({ variant: 'ghost', size: controlSize })"
								aria-label="Next month"
							>
								›
							</button>
						</div>
					</div>

					<div v-if="props.type === 'month'" role="grid" class="calendar-grid -months">
						<CalendarDay
							v-for="(label, i) in monthLabels"
							:key="label"
							type="month"
							:variant="props.variant"
							:selected="inMonth(props.selected, m.year, i)"
							:today="inMonth(props.today, m.year, i)"
						>
							{{ label }}
						</CalendarDay>
					</div>

					<div v-else-if="props.type === 'year'" role="grid" class="calendar-grid -years">
						<CalendarDay
							v-for="y in years"
							:key="y"
							type="year"
							:variant="props.variant"
							:selected="inYear(props.selected, y)"
							:today="inYear(props.today, y)"
						>
							{{ y }}
						</CalendarDay>
					</div>

					<div
						v-else
						role="grid"
						:class="['calendar-grid', { '-week-numbers': props.weekNumbers }]"
					>
						<div class="calendar-weekdays" role="row">
							<div v-if="props.weekNumbers" class="calendar-weekday" aria-hidden="true"></div>
							<div
								v-for="label in weekdayLabels"
								:key="label"
								class="calendar-weekday"
								role="columnheader"
							>
								{{ label }}
							</div>
						</div>

						<div v-for="(row, ri) in m.weeks" :key="ri" class="calendar-week" role="row">
							<div v-if="props.weekNumbers" class="calendar-week-number">
								{{ weekNumber(row) }}
							</div>
							<template v-for="cell in row" :key="cell.iso">
								<div v-if="cell.outside && hideOutside" class="calendar-day-spacer"></div>
								<CalendarDay
									v-else
									:variant="props.variant"
									:outside="cell.outside"
									:today="!cell.outside && cell.iso === props.today"
									:selected="!cell.outside && cell.iso === props.selected"
									:booked="!cell.outside && props.booked.includes(cell.iso)"
									:disabled="!cell.outside && props.disabledDays.includes(cell.iso)"
									:range="rangeOf(cell)"
								>
									{{ cell.day }}
									<span v-if="!cell.outside && props.prices[cell.iso]" class="calendar-day-price">
										{{ props.prices[cell.iso] }}
									</span>
								</CalendarDay>
							</template>
						</div>
					</div>

					<div v-if="props.time && mi === months.length - 1" class="calendar-footer">
						<Input type="time" size="sm" model-value="09:00" />
						<span>–</span>
						<Input type="time" size="sm" model-value="17:00" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
