#!/usr/bin/env node
// Runs Lighthouse CI with the CPU slowdown calibrated to this machine, so every
// CI runner emulates the same phone and the homepage gets the same score for
// the same code.
//
// Lighthouse slows the CPU by a fixed 4x by default, so a fast runner emulates
// a faster phone than a slow one, and the performance score follows the runner.
// This script measures the machine's benchmarkIndex on the homepage, sets
// cpuSlowdownMultiplier = benchmarkIndex / TARGET_BENCHMARK_INDEX, then runs
// `lhci autorun` with it. Calibrating like this is what Lighthouse's throttling
// guide recommends:
// https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md#calibrating-the-cpu-slowdown
//
// Usage, from apps/docs after the docs build:
//   node scripts/lighthouse-ci.mjs [lhci autorun arguments, --config=… included]
//
// It's for mobile configs that keep Lighthouse's default throttling only. A
// desktop config, which throttles the CPU by 1x, must not run through it.

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The benchmarkIndex of the emulated phone. It's in the range Lighthouse gives
// for a mid-tier phone (125 to 800). A lower value is a slower phone, so a
// stricter budget.
const TARGET_BENCHMARK_INDEX = 725;
const CALIBRATION_RUNS = 2;
const RESULTS_DIR = ".lighthouseci";

const fail = (message) => {
	console.error(`Lighthouse calibration failed: ${message}`);
	process.exit(1);
};

// One LHCI version, from the `lighthouse` script in package.json.
const readJson = (path) => {
	try {
		return JSON.parse(readFileSync(path, "utf8"));
	} catch (error) {
		fail(
			`can't read ${path}. Run this from apps/docs, after the docs build. ${error.message}`,
		);
	}
};

const pkg = readJson("package.json");
const lhciVersion = pkg.scripts?.lighthouse?.match(/@lhci\/cli@([^\s]+)/)?.[1];
if (!lhciVersion) {
	fail(
		"can't read the @lhci/cli version from the `lighthouse` script in package.json.",
	);
}

const lhci = (args) => {
	const result = spawnSync(
		"pnpm",
		["dlx", `@lhci/cli@${lhciVersion}`, ...args],
		{ stdio: "inherit" },
	);
	if (result.error) {
		fail(result.error.message);
	}
	return result.status ?? 1;
};

const args = process.argv.slice(2);
const configArgs = args.filter((arg) => arg.startsWith("--config"));

// Calibrate on the homepage only, with the config's staticDistDir and its
// default throttling. Only the performance category is needed, which keeps the
// calibration short. `collect` clears .lighthouseci first.
const calibrationStatus = lhci([
	"collect",
	...configArgs,
	"--url=http://localhost/",
	`--numberOfRuns=${CALIBRATION_RUNS}`,
	"--settings.onlyCategories=performance",
]);
if (calibrationStatus !== 0) {
	fail(`lhci collect exited with ${calibrationStatus}.`);
}

const reports = readdirSync(RESULTS_DIR)
	.filter((file) => /^lhr-.*\.json$/.test(file))
	.map((file) => readJson(join(RESULTS_DIR, file)))
	.sort((a, b) => Date.parse(a.fetchTime) - Date.parse(b.fetchTime));
if (reports.length !== CALIBRATION_RUNS) {
	fail(
		`expected ${CALIBRATION_RUNS} calibration reports in ${RESULTS_DIR}, found ${reports.length}.`,
	);
}

// The first run is cold and reads a much lower benchmark, so use the last.
const report = reports.at(-1);
const benchmarkIndex = report.environment?.benchmarkIndex;
if (!Number.isFinite(benchmarkIndex) || benchmarkIndex <= 0) {
	fail("the calibration report has no benchmarkIndex.");
}

const multiplier =
	Math.round((benchmarkIndex / TARGET_BENCHMARK_INDEX) * 100) / 100;
if (multiplier < 1) {
	fail(
		`benchmarkIndex ${benchmarkIndex} is below the target ${TARGET_BENCHMARK_INDEX}, so this machine can't emulate the target phone (cpuSlowdownMultiplier ${multiplier}).`,
	);
}

console.log(
	`Lighthouse calibration: benchmarkIndexRuns=${reports.map((lhr) => lhr.environment?.benchmarkIndex).join(",")}`,
);
console.log(
	`Lighthouse calibration: benchmarkIndex=${benchmarkIndex} cpuSlowdownMultiplier=${multiplier} target=${TARGET_BENCHMARK_INDEX} uncalibratedPerformance=${report.categories.performance.score}`,
);

process.exit(
	lhci([
		"autorun",
		`--collect.settings.throttling.cpuSlowdownMultiplier=${multiplier}`,
		...args,
	]),
);
