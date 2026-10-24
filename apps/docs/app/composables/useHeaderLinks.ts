import { CHANGELOG_URL, LOGIN_URL } from "~/data/site";

/** The docs header's links, with the one the reader is in highlighted. */
export function useHeaderLinks() {
	const route = useRoute();
	const isIn = (base: string) =>
		route.path === base || route.path.startsWith(`${base}/`);

	return computed(() => [
		// The introduction, rather than /docs, which only redirects to it.
		{
			label: "Docs",
			to: "/docs/getting-started/introduction",
			active: isIn("/docs"),
		},
		{ label: "Changelog", to: CHANGELOG_URL, active: isIn(CHANGELOG_URL) },
		{ label: "Log in", to: LOGIN_URL },
	]);
}
