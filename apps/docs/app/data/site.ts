export const DOCS_URL = "/docs";

export const CHANGELOG_URL = "/changelog";

export const LOGIN_URL = "https://app.styleframe.dev";

export const GITHUB_URL = "https://github.com/uxfront-com/styleframe";

export const STORYBOOK_URL = "https://storybook.styleframe.dev";

export const PLAYGROUND_URL = "https://play.styleframe.dev";

export const X_URL = "https://x.com/styleframe_dev";

export const DISCORD_URL = "https://discord.com/invite/KCVwuGz44M";

export const INTRODUCTION_URL = "/docs/getting-started/introduction";

export const GITHUB_API_URL =
	"https://api.github.com/repos/uxfront-com/styleframe";

// The product and legal pages. As on main, the site's header and footer don't
// link /pro or /pricing.
export const PRO_URL = "/pro";

export const PRICING_URL = "/pricing";

export const SCANNER_URL = "/scanner";

export const FIGMA_URL = "/figma";

export const LICENSE_URL = "/license";

export const PRIVACY_URL = "/privacy";

export const TERMS_URL = "/terms";

export const FIGMA_PLUGIN_URL =
	"https://www.figma.com/community/plugin/1597716416772135340/styleframe";

/** The site's name in social cards and structured data, as `site.name` in nuxt.config.ts. */
export const SITE_NAME = "Styleframe — The Design Systems Styling Engine";

/** The legal pages, linked from every page's footer. */
export const LEGAL_LINKS = [
	{ label: "Privacy", to: PRIVACY_URL },
	{ label: "Terms", to: TERMS_URL },
	{ label: "License", to: LICENSE_URL },
];

/** The footer's credit, as on main. */
export const CREDIT = `Copyright © ${new Date().getFullYear()} styleframe`;
