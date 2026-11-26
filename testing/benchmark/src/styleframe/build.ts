import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
	matchUtilities,
	quickScan,
	registerMatchedUtilities,
} from "@styleframe/scanner";
import {
	buildClassNameLookup,
	generateShorteningMap,
	transpile,
} from "styleframe/transpiler";
import { renderDocument } from "../template";
import type { Styleframe } from "styleframe";

const ROOT = resolve(import.meta.dirname, "../..");
const RESULTS = join(ROOT, "results");

export type BuildResult = {
	dir: string;
	html: string;
	css: string;
};

async function buildVariant(
	instance: Styleframe,
	bodyHtml: string,
	dirName: string,
	minify = false,
): Promise<BuildResult> {
	const parsed = quickScan(bodyHtml);
	const matches = matchUtilities(parsed, instance.root);
	registerMatchedUtilities(instance.root, matches);

	if (minify) {
		const shortMap = generateShorteningMap(instance.root);
		const lookup = buildClassNameLookup(instance.root, shortMap);
		bodyHtml = bodyHtml.replaceAll(
			/class="([^"]*)"/g,
			(_, classes: string) =>
				`class="${classes
					.split(/\s+/)
					.map((cls) => lookup[cls] ?? cls)
					.join(" ")}"`,
		);
	}

	const output = await transpile(instance, {
		type: "css",
		treeshake: true,
		scanner: true,
		minify,
	});
	const css = output.files.find((f) => f.name === "index.css")?.content ?? "";

	const dir = join(RESULTS, dirName);
	const html = renderDocument(bodyHtml, "./index.css");

	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, "index.html"), html, "utf8");
	writeFileSync(join(dir, "index.css"), css, "utf8");

	return { dir, html, css };
}

export async function buildStyleframe(
	bodyHtml: string,
	pageName: string,
): Promise<BuildResult> {
	const { createBenchmarkInstance } = await import("./config");
	return buildVariant(
		createBenchmarkInstance(),
		bodyHtml,
		`${pageName}/styleframe`,
	);
}

export async function buildStyleframeMinified(
	bodyHtml: string,
	pageName: string,
): Promise<BuildResult> {
	const { createBenchmarkInstance } = await import("./config");
	return buildVariant(
		createBenchmarkInstance(),
		bodyHtml,
		`${pageName}/styleframe-minified`,
		true,
	);
}

export async function buildStyleframeShorthand(
	bodyHtml: string,
	pageName: string,
): Promise<BuildResult> {
	const { createShorthandInstance } = await import("./config-shorthand");
	return buildVariant(
		createShorthandInstance(),
		bodyHtml,
		`${pageName}/styleframe-shorthand`,
	);
}
