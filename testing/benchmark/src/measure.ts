import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import {
	buildStyleframe,
	buildStyleframeMinified,
	buildStyleframeShorthand,
} from "./styleframe/build";
import { buildTailwind } from "./tailwind/build";
import type { BenchmarkEntry, BenchmarkReport, PageResult, PageSpec } from "./types";
import { formatReport } from "./utils/report";
import { measure } from "./utils/size";

const ROOT = resolve(import.meta.dirname, "..");
const RESULTS = join(ROOT, "results");

function readPackageVersion(packageName: string): string {
	try {
		const base = resolve(ROOT, "node_modules", ...packageName.split("/"));
		const pkg = JSON.parse(readFileSync(join(base, "package.json"), "utf8"));
		return pkg.version;
	} catch {
		return "unknown";
	}
}

function extractBodyHtml(html: string): string {
	const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
	return match?.[1]?.trim() ?? html;
}

function entry(label: string, dir: string, html: string, css: string): BenchmarkEntry {
	return {
		label,
		htmlPath: join(dir, "index.html"),
		cssPath: join(dir, "index.css"),
		size: measure(extractBodyHtml(html), css),
	};
}

async function buildPage(spec: PageSpec): Promise<PageResult> {
	const pageName = spec.name;
	console.log(`  ${pageName}...`);

	const tw = buildTailwind(spec.tailwind, pageName);
	const sf = await buildStyleframe(spec.styleframe, pageName);
	const sfMin = await buildStyleframeMinified(spec.styleframe, pageName);
	const sfShort = await buildStyleframeShorthand(spec.styleframeShorthand, pageName);

	return {
		page: pageName,
		entries: [
			entry("Tailwind v4", tw.dir, tw.html, tw.css),
			entry("Styleframe", sf.dir, sf.html, sf.css),
			entry("SF Minified", sfMin.dir, sfMin.html, sfMin.css),
			entry("SF Shorthand", sfShort.dir, sfShort.html, sfShort.css),
		],
	};
}

async function main(): Promise<void> {
	const pageModules = await Promise.all([
		import("./pages/dashboard"),
		import("./pages/marketing"),
		import("./pages/blog"),
		import("./pages/ecommerce"),
		import("./pages/settings"),
	]);

	const specs: Array<PageSpec> = [
		pageModules[0].dashboard,
		pageModules[1].marketing,
		pageModules[2].blog,
		pageModules[3].ecommerce,
		pageModules[4].settings,
	];

	console.log("Building all pages...");
	const pages: Array<PageResult> = [];
	for (const spec of specs) {
		pages.push(await buildPage(spec));
	}

	const report: BenchmarkReport = {
		date: new Date().toISOString().slice(0, 10),
		versions: {
			tailwind: readPackageVersion("tailwindcss"),
			styleframe: readPackageVersion("styleframe"),
			node: process.version,
		},
		visualParityPassed: false,
		entries: [],
		inProcessTiming: {},
		cliColdTiming: {},
	};

	const reportPath = join(RESULTS, "report.md");
	const reportText = formatReport(report, pages);
	writeFileSync(reportPath, reportText, "utf8");
	console.log(`\n${reportText}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
