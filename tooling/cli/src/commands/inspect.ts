import { type InspectSnapshot, inspect } from "@styleframe/core";
import { loadConfiguration } from "@styleframe/loader";
import { defineCommand } from "citty";
import consola from "consola";
import { resolveConfigFile } from "../utils";

const SECTIONS = [
	"variables",
	"themes",
	"utilities",
	"modifiers",
	"recipes",
] as const;

type Section = (typeof SECTIONS)[number];

function isSection(value: unknown): value is Section {
	return SECTIONS.includes(value as Section);
}

const formatters: {
	[S in Section]: (item: InspectSnapshot[S][number]) => string[];
} = {
	variables: ({ name, property, value }) => [`${name}  ${property}: ${value}`],
	themes: ({ name, selector, overrides }) => [
		`${name}  ${selector}`,
		...overrides.map(({ name, value }) => `  ${name}: ${value}`),
	],
	utilities: ({ name, values, classNames, modifiers }) => [
		name,
		`  values: ${values.join(", ")}`,
		...(modifiers.length > 0 ? [`  modifiers: ${modifiers.join(", ")}`] : []),
		`  classes: ${classNames.join(" ")}`,
	],
	modifiers: ({ key }) => [key.join(", ")],
	recipes: ({ name, variants, defaultVariants }) => [
		name,
		...Object.entries(variants).map(
			([axis, options]) =>
				`  ${axis}: ${options.join(", ")}${axis in defaultVariants ? ` (default: ${defaultVariants[axis]})` : ""}`,
		),
	],
};

function formatSection<S extends Section>(
	section: S,
	items: InspectSnapshot[S],
): string {
	const lines = (items as InspectSnapshot[S][number][]).flatMap((item) =>
		formatters[section](item).map((line) => `  ${line}`),
	);

	return [`${section} (${items.length})`, ...lines].join("\n");
}

export default defineCommand({
	meta: {
		name: "inspect",
		description:
			"List the variables, themes, utilities, modifiers, and recipes a Styleframe configuration registers",
	},
	args: {
		entry: {
			type: "positional",
			description: "Entry point file to inspect",
			default: "styleframe.config.ts",
			valueHint: "path",
		},
		section: {
			type: "positional",
			description: `One section to print: ${SECTIONS.join(", ")}`,
			required: false,
		},
		json: {
			type: "boolean",
			description: "Print the result as one JSON document on stdout",
			default: false,
		},
	},
	async run({ args }) {
		let { entry, section } = args;

		// `styleframe inspect themes` names a section, not an entry
		if (section === undefined && isSection(entry)) {
			section = entry;
			entry = "styleframe.config.ts";
		}

		if (section !== undefined && !isSection(section)) {
			consola.error(
				`Unknown section: ${section}. Use one of ${SECTIONS.join(", ")}.`,
			);
			process.exitCode = 1;
			return;
		}

		if (!resolveConfigFile(entry)) {
			consola.error(`Config file not found: ${entry}`);
			process.exitCode = 1;
			return;
		}

		const snapshot = inspect(await loadConfiguration({ entry }));
		const sections = section ? [section] : SECTIONS;

		if (args.json) {
			const document = Object.fromEntries(
				sections.map((name) => [name, snapshot[name]]),
			);
			process.stdout.write(`${JSON.stringify(document, null, 2)}\n`);
			return;
		}

		process.stdout.write(
			`${sections.map((name) => formatSection(name, snapshot[name])).join("\n\n")}\n`,
		);
	},
});
