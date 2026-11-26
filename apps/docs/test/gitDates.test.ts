import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { parseGitLog, readGitDates } from "../modules/gitDates";

describe("parseGitLog", () => {
	it("dates each file by the newest commit that changed it", () => {
		const log = [
			"",
			"2026-11-15\n\ncontent/a.md\napp/pages/index.vue\n",
			"2026-11-10\n", // a merge, with no files
			"2026-11-01\n\ncontent/a.md\ncontent/b.md\n",
		].join("\0");

		expect(parseGitLog(log)).toEqual({
			"content/a.md": "2026-11-15",
			"app/pages/index.vue": "2026-11-15",
			"content/b.md": "2026-11-01",
		});
	});

	it("reads an empty log as no dates", () => {
		expect(parseGitLog("")).toEqual({});
	});
});

describe("readGitDates", () => {
	const root = mkdtempSync(join(tmpdir(), "git-dates-"));
	afterAll(() => rmSync(root, { recursive: true, force: true }));

	const git = (cwd: string, args: Array<string>, date = "2026-01-01") =>
		execFileSync("git", args, {
			cwd,
			stdio: "ignore",
			env: {
				...process.env,
				GIT_AUTHOR_NAME: "Test",
				GIT_AUTHOR_EMAIL: "test@example.com",
				GIT_COMMITTER_NAME: "Test",
				GIT_COMMITTER_EMAIL: "test@example.com",
				GIT_AUTHOR_DATE: `${date}T12:00:00Z`,
				GIT_COMMITTER_DATE: `${date}T12:00:00Z`,
			},
		});

	const repo = join(root, "repo");
	const commit = (file: string, date: string) => {
		writeFileSync(join(repo, file), date);
		git(repo, ["add", "."]);
		git(repo, ["commit", "-q", "-m", file], date);
	};

	it("reads the dates of the page sources from the history", () => {
		mkdirSync(join(repo, "content"), { recursive: true });
		mkdirSync(join(repo, "app/pages"), { recursive: true });
		git(repo, ["init", "-q"]);
		commit("content/a.md", "2026-01-02");
		commit("app/pages/index.vue", "2026-03-04");
		commit("content/a.md", "2026-05-06");
		commit("other.txt", "2026-07-08");

		expect(readGitDates(repo)).toEqual({
			dates: {
				"content/a.md": "2026-05-06",
				"app/pages/index.vue": "2026-03-04",
			},
		});
	});

	it("gives no dates from a shallow clone", () => {
		const clone = join(root, "clone");
		git(root, ["clone", "-q", "--depth=1", `file://${repo}`, clone]);

		expect(readGitDates(clone)).toEqual({
			dates: {},
			missing: "the clone is shallow",
		});
	});

	it("gives no dates outside a repository", () => {
		const outside = mkdtempSync(join(tmpdir(), "no-git-"));
		try {
			expect(readGitDates(outside).dates).toEqual({});
			expect(readGitDates(outside).missing).toBeDefined();
		} finally {
			rmSync(outside, { recursive: true, force: true });
		}
	});
});
