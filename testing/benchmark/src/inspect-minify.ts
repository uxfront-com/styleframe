import { quickScan, matchUtilities, registerMatchedUtilities } from "@styleframe/scanner";
import { generateShorteningMap, buildClassNameLookup } from "styleframe/transpiler";

import { styleframePage } from "./pages/ecommerce";
import { createBenchmarkInstance } from "./styleframe/config";

const s = createBenchmarkInstance();
const parsed = quickScan(styleframePage);
const matches = matchUtilities(parsed, s.root);
registerMatchedUtilities(s.root, matches);

const shortMap = generateShorteningMap(s.root);
const lookup = buildClassNameLookup(s.root, shortMap);

console.log("=== PROPERTY SHORTENING MAP ===");
console.log(JSON.stringify(shortMap.p, null, 2));
console.log();
console.log("=== VALUE SHORTENING MAP ===");
console.log(JSON.stringify(shortMap.v, null, 2));
console.log();

console.log("=== SAMPLE CLASS MAPPINGS ===");
const entries = Object.entries(lookup);
for (const [from, to] of entries.slice(0, 40)) {
	console.log(from.padEnd(42), "→", to);
}
console.log("...");
console.log("Total:", entries.length, "mappings");
console.log();

let origLen = 0;
let shortLen = 0;
for (const [from, to] of entries) {
	origLen += from.length;
	shortLen += to.length;
}
console.log("Avg original class length:", (origLen / entries.length).toFixed(1));
console.log("Avg minified class length:", (shortLen / entries.length).toFixed(1));
console.log(
	"Avg reduction per class:",
	((origLen - shortLen) / entries.length).toFixed(1),
	"chars",
);
console.log("Overall reduction:", ((1 - shortLen / origLen) * 100).toFixed(1) + "%");
