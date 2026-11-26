export default defineAppConfig({
	/**
	 * Neutral shell defaults. This layer ships NO product branding — consuming
	 * apps supply title, logos, socials, GitHub, footer, TOC links and palette
	 * via their own `app.config.ts` (merged over these defaults by Nuxt's `defu`
	 * layer merge). `modules/config.ts` also fills `seo`/`header`/`github` from
	 * the consumer's `package.json` + git as fallbacks.
	 *
	 * @docs https://www.docus.dev/concepts/configuration#global-configuration
	 */
	toc: {
		// Title of the main table of contents
		title: "On this page",
	},

	/**
	 * Opt-out flags for the layer's client plugins. Defaults keep them on so an
	 * existing consumer is unchanged; a consumer opts out by setting `false`.
	 */
	analytics: {
		// PostHog analytics plugin (production only, requires a runtime key).
		enabled: true,
	},
	i18nRedirect: {
		// Redirect `/` to `/{locale}` (only fires when i18n is configured).
		enabled: true,
	},

	ui: {
		// Palette-free type discriminant — NOT branding. Nuxt UI's wide
		// `AppConfigUI` type (which permits the component slot overrides below)
		// only applies to `ui` when a `colors` key is present; without it the
		// narrow `nuxt.schema.ts` Studio type wins and the slots fail
		// excess-property checks. The empty object bakes in no palette; each
		// consumer supplies the real `colors` (merged over this by `defu`).
		colors: {},
		// Neutral Nuxt UI Pro component polish — reusable shell defaults every
		// consumer inherits, not styleframe branding.
		commandPalette: {
			slots: {
				input: "[&_.iconify]:size-4 [&_.iconify]:mx-0.5",
				itemLeadingIcon: "size-4 mx-0.5",
			},
		},
		contentNavigation: {
			slots: {
				trigger: "font-normal text-muted data-[state=open]:text-muted cursor-pointer",
				linkLeadingIcon: "size-4 mr-1",
				linkTrailing: "hidden",
			},
			compoundVariants: [
				{
					variant: "link",
					active: false,
					disabled: false,
					class: {
						linkLeadingIcon: "group-data-[state=open]:text-dimmed",
					},
				},
			],
			defaultVariants: {
				variant: "link",
			},
		},
		pageLinks: {
			slots: {
				linkLeadingIcon: "size-4",
				linkLabelExternalIcon: "size-2.5",
			},
		},
		pageCard: {
			slots: {
				root: "rounded-xl",
			},
		},
		pricingTable: {
			slots: {
				tierTitle: "text-highlighted text-2xl sm:text-3xl text-pretty font-semibold",
			},
		},
	},
});
