/**
 * Links each changelog entry in `llms.txt` to its Markdown copy, as Docus does
 * for the docs pages. Docus's agent discovery leaves a link alone when its
 * last segment looks like a file name, and every entry's, like `3.9.0`, does.
 * modules/rawChangelog.ts prerenders the copies.
 */
export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("llms:generate", (_event, options) => {
		for (const section of options.sections) {
			section.links = section.links?.map((link) => {
				const url = new URL(link.href, options.domain);
				const entry = url.pathname.match(/^\/changelog\/([^/]+)$/)?.[1];
				return entry ? { ...link, href: new URL(`/raw/changelog/${entry}.md`, url).href } : link;
			});
		}
	});
});
