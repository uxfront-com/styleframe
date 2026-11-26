import { gzipSync } from "node:zlib";

import type { SizeMeasurement } from "../types";

export function measureBytes(content: string): number {
	return Buffer.byteLength(content, "utf8");
}

export function measureGzipBytes(content: string): number {
	return gzipSync(Buffer.from(content, "utf8"), { level: 6 }).length;
}

const CLASS_ATTR_RE = /class="([^"]*)"/g;

export function extractClassAttributes(html: string): Array<string> {
	const matches = html.matchAll(CLASS_ATTR_RE);
	const result: Array<string> = [];
	for (const m of matches) {
		const value = m[1];
		if (value && value.trim().length > 0) {
			result.push(value);
		}
	}
	return result;
}

export function classCountsPerElement(html: string): Array<number> {
	return extractClassAttributes(html).map((attr) => attr.trim().split(/\s+/).length);
}

export function p95(values: Array<number>): number {
	if (values.length === 0) {
		return 0;
	}
	const sorted = [...values].sort((a, b) => a - b);
	const index = Math.ceil(sorted.length * 0.95) - 1;
	return sorted[Math.max(0, Math.min(sorted.length - 1, index))] ?? 0;
}

export function measure(html: string, css: string): SizeMeasurement {
	const counts = classCountsPerElement(html);
	const totalClasses = counts.reduce((sum, c) => sum + c, 0);
	const elementsWithClasses = counts.length;
	const avg = elementsWithClasses === 0 ? 0 : totalClasses / elementsWithClasses;

	return {
		rawHtmlBytes: measureBytes(html),
		rawCssBytes: measureBytes(css),
		gzippedHtmlBytes: measureGzipBytes(html),
		gzippedCssBytes: measureGzipBytes(css),
		gzippedTotalBytes: measureGzipBytes(html + css),
		totalClasses,
		elementsWithClasses,
		avgClassesPerElement: avg,
		p95ClassesPerElement: p95(counts),
	};
}
