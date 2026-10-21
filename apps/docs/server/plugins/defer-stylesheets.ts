/**
 * The UXFront pages inline every style they render, and @uxfront/layer-ui
 * loads the entry stylesheet after their first paint. The docs make the app
 * big enough that the build also splits the components' styles into chunk
 * stylesheets, which the layer leaves in the head, where they block the first
 * paint. On those pages, load them without blocking it.
 */
const CHUNK_STYLESHEET =
	/<link rel="stylesheet" href="([^"]*\/_nuxt\/(?!entry\.)[^"]+\.css)"([^>]*)>/g;

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("render:html", (html, { event }) => {
		if (!event.context.uxfrontPage) return;
		html.head = html.head.map((chunk) =>
			chunk.replace(
				CHUNK_STYLESHEET,
				(_, href: string, attributes: string) =>
					`<link rel="stylesheet" href="${href}"${attributes} media="print" onload="this.media='all'">`,
			),
		);
	});
});
