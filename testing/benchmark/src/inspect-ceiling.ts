import { gzipSync } from "node:zlib";

import { quickScan, matchUtilities, registerMatchedUtilities } from "@styleframe/scanner";
import { generateShorteningMap, buildClassNameLookup } from "styleframe/transpiler";

import { styleframePage as blog } from "./pages/blog";
import { styleframePage as dash } from "./pages/dashboard";
import { styleframePage as ecom } from "./pages/ecommerce";
import { styleframePage as mktg } from "./pages/marketing";
import { styleframePage as sett } from "./pages/settings";
import { createBenchmarkInstance } from "./styleframe/config";

const allPages = [dash, mktg, blog, ecom, sett];

const gz = (s: string) => gzipSync(Buffer.from(s, "utf8"), { level: 6 }).length;

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ids: Array<string> = [];
for (let i = 0; i < chars.length; i++) {
	ids.push(chars[i]!);
}
for (let i = 0; i < chars.length; i++) {
	for (let j = 0; j < chars.length; j++) {
		ids.push(chars[i]! + chars[j]!);
	}
}

let totalOrig = 0;
let totalCurrent = 0;
let totalOptimal = 0;
let totalOrigRaw = 0;
let totalCurrentRaw = 0;
let totalOptimalRaw = 0;

for (const html of allPages) {
	const allClasses = new Set<string>();
	for (const m of html.matchAll(/class="([^"]*)"/g)) {
		for (const c of m[1]!.split(/\s+/)) {
			if (c) {
				allClasses.add(c);
			}
		}
	}

	const lookup = new Map<string, string>();
	let idx = 0;
	for (const c of allClasses) {
		lookup.set(c, ids[idx++]!);
	}
	const optimal = html.replaceAll(
		/class="([^"]*)"/g,
		(_, cl: string) =>
			`class="${cl
				.split(/\s+/)
				.map((c) => lookup.get(c) ?? c)
				.join(" ")}"`,
	);

	const s = createBenchmarkInstance();
	const parsed = quickScan(html);
	const matches = matchUtilities(parsed, s.root);
	registerMatchedUtilities(s.root, matches);
	const shortMap = generateShorteningMap(s.root);
	const classLookup = buildClassNameLookup(s.root, shortMap);
	const current = html.replaceAll(
		/class="([^"]*)"/g,
		(_, cl: string) =>
			`class="${cl
				.split(/\s+/)
				.map((c) => classLookup[c] ?? c)
				.join(" ")}"`,
	);

	totalOrigRaw += html.length;
	totalOrig += gz(html);
	totalCurrentRaw += current.length;
	totalCurrent += gz(current);
	totalOptimalRaw += optimal.length;
	totalOptimal += gz(optimal);
}

console.log("=== ALL 5 PAGES COMBINED (HTML body only) ===");
console.log("                  Raw          Gzipped");
console.log(
	"Original:    ",
	totalOrigRaw.toLocaleString().padStart(8),
	"B  ",
	totalOrig.toLocaleString().padStart(6),
	"B",
);
console.log(
	"Current min: ",
	totalCurrentRaw.toLocaleString().padStart(8),
	"B  ",
	totalCurrent.toLocaleString().padStart(6),
	`B   (${((1 - totalCurrent / totalOrig) * 100).toFixed(1)}% gz savings)`,
);
console.log(
	"Optimal min: ",
	totalOptimalRaw.toLocaleString().padStart(8),
	"B  ",
	totalOptimal.toLocaleString().padStart(6),
	`B   (${((1 - totalOptimal / totalOrig) * 100).toFixed(1)}% gz savings)`,
);
console.log();
console.log(
	"Gap: optimal is",
	((1 - totalOptimal / totalCurrent) * 100).toFixed(1) + "% smaller gz than current",
);
console.log(
	"Gap: optimal is",
	((1 - totalOptimalRaw / totalCurrentRaw) * 100).toFixed(1) + "% smaller raw than current",
);
