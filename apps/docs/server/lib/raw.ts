/** `/raw/<path>.md`: the title and description, then the page without its frontmatter. */
export function rawPage(
	page: { title: string; description: string },
	source: string,
): string {
	const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
	return `# ${page.title}\n\n> ${page.description}\n\n${body}\n`;
}
