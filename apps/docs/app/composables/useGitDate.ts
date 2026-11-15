/**
 * The date of the last commit that changed a page's source file, like
 * `content/docs/03.design-tokens/06.colors.md`, as YYYY-MM-DD. modules/gitDates.ts
 * reads them when the site is built. The page is rendered on the server, which
 * reads the date, and the payload carries it to the browser, which doesn't ship
 * the dates.
 */
export async function useGitDate(file: string) {
	const date = useState<string | undefined>(`git-date:${file}`);
	if (import.meta.server) {
		const { default: dates } = await import("#build/git-dates.mjs");
		date.value = dates[file];
	}
	return date;
}
