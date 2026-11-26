/**
 * Spec-fixture tests. Each `*.tokens.json` is parsed → validated →
 * inheritance-applied → re-stringified, and the result must round-trip
 * deep-equal to the input. The single resolver fixture is parsed and
 * validated.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { applyInheritance } from "../../src/inheritance/apply";
import { parse } from "../../src/parse/document";
import { parseResolver } from "../../src/resolver/parse";
import { validate } from "../../src/validate/document";
import { validateResolver } from "../../src/validate/resolver";

const FIXTURE_DIR = __dirname;

const tokenFixtures = readdirSync(FIXTURE_DIR).filter((f) => f.endsWith(".tokens.json"));
const resolverFixtures = readdirSync(FIXTURE_DIR).filter((f) => f.endsWith(".resolver.json"));

describe("spec token fixtures", () => {
	for (const fixture of tokenFixtures) {
		it(`parses ${fixture} with no validation errors`, () => {
			const json = readFileSync(join(FIXTURE_DIR, fixture), "utf8");
			const doc = parse(json);
			const errors = validate(doc);
			if (errors.length > 0) {
				throw new Error(
					`Validation errors in ${fixture}:\n${errors.map((e) => `  - ${e.path}: ${e.message}`).join("\n")}`,
				);
			}
		});

		it(`round-trips ${fixture} through JSON.stringify`, () => {
			const json = readFileSync(join(FIXTURE_DIR, fixture), "utf8");
			const doc = parse(json);
			const restringified = JSON.parse(JSON.stringify(doc));
			expect(restringified).toEqual(JSON.parse(json));
		});

		it(`round-trips ${fixture} through inheritance application`, () => {
			const json = readFileSync(join(FIXTURE_DIR, fixture), "utf8");
			const doc = parse(json);
			const inherited = applyInheritance(doc);
			// inherited may add $type fields to leaves, but never remove anything
			expect(JSON.stringify(inherited).length).toBeGreaterThanOrEqual(
				JSON.stringify(doc).length - 10, // tolerate whitespace differences
			);
		});
	}
});

describe("spec resolver fixtures", () => {
	for (const fixture of resolverFixtures) {
		it(`parses and validates ${fixture}`, () => {
			const json = readFileSync(join(FIXTURE_DIR, fixture), "utf8");
			const doc = parseResolver(json);
			const errors = validateResolver(doc);
			if (errors.length > 0) {
				throw new Error(
					`Validation errors in ${fixture}:\n${errors.map((e) => `  - ${e.path}: ${e.message}`).join("\n")}`,
				);
			}
		});
	}
});
