/**
 * The security headers every response from the site carries: `routeRules` in
 * nuxt.config.ts sets them on every route, and the static deploy writes them
 * into its config.
 */
export const SECURITY_HEADERS = {
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-Frame-Options": "DENY",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
	"Cross-Origin-Opener-Policy": "same-origin",
};
