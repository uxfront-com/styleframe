import type {
	BenchmarkEntry,
	BenchmarkReport,
	PageResult,
	SizeMeasurement,
} from "../types";

function kb(bytes: number): string {
	return `${(bytes / 1024).toFixed(2)} kB`;
}

function b(value: number): string {
	return `${value.toLocaleString()} B`;
}

function pct(value: number, baseline: number): string {
	if (baseline === 0) {
		return "—";
	}
	const diff = ((value - baseline) / baseline) * 100;
	const sign = diff >= 0 ? "+" : "";
	return `${sign}${diff.toFixed(1)}%`;
}

function row(cells: Array<string | number>): string {
	return `| ${cells.join(" | ")} |`;
}

function gzippedTable(entries: Array<BenchmarkEntry>): string {
	const baseline = entries[0]?.size.gzippedTotalBytes ?? 0;
	const lines = [
		"| Configuration | HTML | CSS | Total | vs Tailwind |",
		"|---|---|---|---|---|",
	];
	for (const entry of entries) {
		const isBaseline = entry === entries[0];
		lines.push(
			row([
				entry.label,
				kb(entry.size.gzippedHtmlBytes),
				kb(entry.size.gzippedCssBytes),
				kb(entry.size.gzippedTotalBytes),
				isBaseline ? "baseline" : pct(entry.size.gzippedTotalBytes, baseline),
			]),
		);
	}
	return lines.join("\n");
}

function rawTable(entries: Array<BenchmarkEntry>): string {
	const baselineRaw =
		(entries[0]?.size.rawHtmlBytes ?? 0) + (entries[0]?.size.rawCssBytes ?? 0);
	const lines = [
		"| Configuration | HTML | CSS | HTML+CSS | vs Tailwind |",
		"|---|---|---|---|---|",
	];
	for (const entry of entries) {
		const total = entry.size.rawHtmlBytes + entry.size.rawCssBytes;
		const isBaseline = entry === entries[0];
		lines.push(
			row([
				entry.label,
				b(entry.size.rawHtmlBytes),
				b(entry.size.rawCssBytes),
				b(total),
				isBaseline ? "baseline" : pct(total, baselineRaw),
			]),
		);
	}
	return lines.join("\n");
}

function densityTable(entries: Array<BenchmarkEntry>): string {
	const lines = [
		"| Configuration | Total classes | Avg/el | P95/el |",
		"|---|---|---|---|",
	];
	for (const entry of entries) {
		lines.push(
			row([
				entry.label,
				entry.size.totalClasses,
				entry.size.avgClassesPerElement.toFixed(2),
				entry.size.p95ClassesPerElement,
			]),
		);
	}
	return lines.join("\n");
}

function aggregateEntries(pages: Array<PageResult>): Array<BenchmarkEntry> {
	if (pages.length === 0) {
		return [];
	}

	const labels = pages[0]!.entries.map((e) => e.label);
	return labels.map((label, i) => {
		const sizes = pages.map((p) => p.entries[i]!.size);
		const sum = (fn: (s: SizeMeasurement) => number) =>
			sizes.reduce((acc, s) => acc + fn(s), 0);

		return {
			label,
			htmlPath: "",
			cssPath: "",
			size: {
				rawHtmlBytes: sum((s) => s.rawHtmlBytes),
				rawCssBytes: sum((s) => s.rawCssBytes),
				gzippedHtmlBytes: sum((s) => s.gzippedHtmlBytes),
				gzippedCssBytes: sum((s) => s.gzippedCssBytes),
				gzippedTotalBytes: sum((s) => s.gzippedTotalBytes),
				totalClasses: sum((s) => s.totalClasses),
				elementsWithClasses: sum((s) => s.elementsWithClasses),
				avgClassesPerElement:
					sum((s) => s.totalClasses) /
					Math.max(
						1,
						sum((s) => s.elementsWithClasses),
					),
				p95ClassesPerElement: Math.max(
					...sizes.map((s) => s.p95ClassesPerElement),
				),
			},
		};
	});
}

export function formatReport(
	report: BenchmarkReport,
	pages: Array<PageResult>,
): string {
	const aggregate = aggregateEntries(pages);
	const sections: Array<string> = [
		"# Styleframe vs Tailwind CSS Benchmark",
		"",
		`**Date:** ${report.date}`,
		`**Tailwind:** ${report.versions.tailwind}`,
		`**Styleframe:** ${report.versions.styleframe}`,
		`**Node:** ${report.versions.node}`,
		`**Pages:** ${pages.map((p) => p.page).join(", ")}`,
		"",

		"## Aggregate (all pages combined, gzipped)",
		"",
		gzippedTable(aggregate),
		"",

		"## Aggregate (all pages combined, raw)",
		"",
		rawTable(aggregate),
		"",

		"## Aggregate class density",
		"",
		densityTable(aggregate),
		"",
	];

	for (const pageResult of pages) {
		sections.push(
			`## ${pageResult.page} (gzipped)`,
			"",
			gzippedTable(pageResult.entries),
			"",
			`## ${pageResult.page} (raw)`,
			"",
			rawTable(pageResult.entries),
			"",
		);
	}

	sections.push(
		"See METHODOLOGY.md for design token alignment, caveats, and reproduction steps.",
		"",
	);

	return sections.join("\n");
}
