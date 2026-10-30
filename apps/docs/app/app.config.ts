import {
	CHANGELOG_URL,
	DISCORD_URL,
	GITHUB_URL,
	INTRODUCTION_URL,
	LOGIN_URL,
	PLAYGROUND_URL,
	STORYBOOK_URL,
	X_URL,
} from "./data/site";

export default defineAppConfig({
	seo: {
		title: "styleframe",
		titleTemplate: "%s - styleframe",
		description:
			"Write composable, type-safe, future-proof Design Systems code using styleframe's powerful TypeScript CSS API.",
	},
	header: {
		title: "styleframe",
		// Docus's header shows the logo, and the layer signs it "by UXFront"
		// (`docsTheme.byline`).
		logo: {
			alt: "Styleframe",
			light: "/logotype-light.svg",
			dark: "/logotype-dark.svg",
		},
	},
	// The docs' GitHub, "Edit this page" and "Report an issue" links. Docus reads
	// them from the git remote otherwise, which not every checkout has. The
	// content is in apps/docs/content/, so `rootDir` points there.
	github: {
		url: GITHUB_URL,
		branch: "main",
		rootDir: "apps/docs",
	},
	// The footer's links, beside GitHub.
	socials: {
		x: X_URL,
		discord: DISCORD_URL,
	},
	// The sections as tabs below the header (see useDocsSections).
	navigation: {
		sub: "header",
	},
	toc: {
		title: "On this page",
		bottom: {
			title: "Resources",
			links: [
				{
					icon: "i-simple-icons-storybook",
					label: "Storybook",
					to: STORYBOOK_URL,
					target: "_blank",
				},
				{
					icon: "i-simple-icons-playwright",
					label: "Playground",
					to: PLAYGROUND_URL,
					target: "_blank",
				},
				{
					icon: "i-lucide-star",
					label: "Star on GitHub",
					to: GITHUB_URL,
					target: "_blank",
				},
				{
					icon: "i-lucide-file-text",
					label: "Changelog",
					to: CHANGELOG_URL,
				},
				{
					icon: "i-simple-icons-discord",
					label: "Community",
					to: DISCORD_URL,
					target: "_blank",
				},
			],
		},
	},
	docsTheme: {
		// The frameworks the docs' examples come in, in the order the sidebar's
		// select shows them. The first is the default. `value` names each
		// framework's slot in `::framework-switcher` (`#react`, `#other`, `#vue`).
		frameworks: [
			{ value: "react", label: "React", icon: "i-mdi-react" },
			{ value: "other", label: "Vanilla", icon: "i-mdi-language-typescript" },
			{ value: "vue", label: "Vue", icon: "i-mdi-vuejs" },
		],
		byline: true,
		// The header's links, beside its buttons, or atop its menu on smaller
		// screens. The docs link goes to the introduction, rather than /docs,
		// which only redirects to it, and stays active on every docs page.
		headerLinks: [
			{ label: "Docs", to: INTRODUCTION_URL, activeFor: "/docs" },
			{ label: "Changelog", to: CHANGELOG_URL, activeFor: CHANGELOG_URL },
			{ label: "Log in", to: LOGIN_URL },
		],
	},
	ui: {
		colors: {
			// The brand teal (see app/app.css for its shades).
			primary: "teal",
			neutral: "zinc",
		},
	},
});
