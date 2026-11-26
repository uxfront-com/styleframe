import { execFileSync } from "node:child_process";
import {
	addServerTemplate,
	addTemplate,
	addTypeTemplate,
	defineNuxtModule,
	useLogger,
} from "@nuxt/kit";

/** The folders whose files pages are built from, relative to the app. */
const SOURCES = ["content/", "app/pages/"];

/**
 * Reads `git log --format=%x00%cs --name-only` into the date of the last
 * commit that changed each file, as `git log -1 --format=%cs -- <file>` gives
 * it. The log runs newest first, so a file's first commit in it is its last.
 */
export function parseGitLog(log: string): Record<string, string> {
	const dates: Record<string, string> = {};
	for (const commit of log.split("\0").slice(1)) {
		const [date, ...files] = commit.split("\n");
		for (const file of files) {
			if (file && !(file in dates)) {
				dates[file] = date!;
			}
		}
	}
	return dates;
}

/**
 * The date of the last commit that changed each page source, by its path from
 * the app's directory, like `content/docs/03.design-tokens/06.colors.md`. Empty
 * without the history to read it from: a shallow clone would date every file
 * with its one commit, and the build date isn't when a page last changed.
 */
export function readGitDates(cwd: string): {
	dates: Record<string, string>;
	missing?: string;
} {
	const git = (...args: Array<string>) =>
		execFileSync("git", ["-c", "core.quotePath=false", ...args], {
			cwd,
			encoding: "utf8",
			maxBuffer: 64 * 1024 * 1024,
			stdio: ["ignore", "pipe", "ignore"],
		});

	try {
		if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
			return { dates: {}, missing: "the clone is shallow" };
		}
		const dates = parseGitLog(
			git(
				"log",
				"--format=%x00%cs",
				"--name-only",
				"--relative",
				"--",
				...SOURCES,
			),
		);
		return { dates };
	} catch {
		return { dates: {}, missing: "Git or its history isn't available" };
	}
}

/**
 * Dates each page by the last commit that changed its source, read once when
 * the site is built. The sitemap's `<lastmod>` and the docs pages'
 * `dateModified` read them from `#git-dates` on the server and
 * `#build/git-dates.mjs` in the app (see useGitDate).
 */
export default defineNuxtModule({
	meta: { name: "git-dates" },
	setup(_options, nuxt) {
		const { dates, missing } = readGitDates(nuxt.options.rootDir);
		if (missing) {
			useLogger("git-dates").warn(
				`No Git history, as ${missing}: the sitemap has no <lastmod> and the docs pages no dateModified. Fetch the whole history before the build (git fetch --unshallow).`,
			);
		}

		const contents = `export default ${JSON.stringify(dates)};\n`;
		addTemplate({ filename: "git-dates.mjs", getContents: () => contents });
		addServerTemplate({ filename: "#git-dates", getContents: () => contents });

		const types = [
			"/** The date of the last commit that changed each page source, as YYYY-MM-DD. */",
			"declare const dates: Record<string, string>;",
			"export default dates;",
		].join("\n");
		addTypeTemplate(
			{
				filename: "types/git-dates.d.ts",
				getContents: () =>
					[
						`declare module "#git-dates" {\n${types}\n}`,
						`declare module "#build/git-dates.mjs" {\n${types}\n}`,
					].join("\n"),
			},
			{ nuxt: true, nitro: true },
		);
	},
});
