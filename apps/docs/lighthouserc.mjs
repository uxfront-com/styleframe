// Lighthouse CI on the docs build, with the thresholds the uxfront.com sites
// share: the homepage in all four categories, and the docs pages in all but
// performance.
import { lighthouseConfig } from "@uxfront/site-checks/lighthouse";

export const collect = {
	staticDistDir: ".output/public",
	url: [
		"http://localhost/",
		"http://localhost/docs/getting-started/introduction.html",
		"http://localhost/docs/getting-started/installation/vite.html",
		"http://localhost/docs/api/variables.html",
		"http://localhost/docs/theme/design-tokens/colors.html",
		"http://localhost/docs/getting-started/comparisons/tailwind.html",
	],
};

export const matrix = [
	{
		matchingUrlPattern: String.raw`^http://localhost:\d+/$`,
		categories: ["performance", "accessibility", "best-practices", "seo"],
	},
	{
		matchingUrlPattern: String.raw`^http://localhost:\d+/docs/`,
		categories: ["accessibility", "best-practices", "seo"],
	},
];

export default lighthouseConfig({ collect, matrix });
