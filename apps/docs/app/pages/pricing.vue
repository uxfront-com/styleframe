<script setup lang="ts">
import { corridor, ink, stack, threshold } from "@uxfront/scene/formations";
import {
	DISCORD_URL,
	INTRODUCTION_URL,
	LICENSE_URL,
	PRICING_URL,
	SITE_NAME,
} from "~/data/site";

useUxHead({
	title: "Pricing - styleframe",
	description:
		"Write composable, type-safe, future-proof Design Systems code using styleframe's powerful TypeScript CSS API.",
	siteName: SITE_NAME,
	path: PRICING_URL,
	image: {
		path: "/og/pricing.png",
		width: 1200,
		height: 630,
		alt: "Start using styleframe for free",
	},
});

const scene = [
	threshold({ label: "Pricing" }),
	stack({ label: "Plans" }),
	ink({ label: "FAQ" }),
	corridor({ label: "Get started" }),
];

const nav = [
	{ href: "#plans", label: "Plans", index: "01" },
	{ href: "#faq", label: "FAQ", index: "02" },
];

const support = "mailto:support@styleframe.dev";
</script>

<template>
	<UxSite :scene="scene" skip-to="#plans" skip-label="Skip to the plans">
		<template #header>
			<SiteHeader :nav="nav" nav-label="Pricing" />
		</template>

		<UxHero
			kicker="Pricing"
			title="Start using styleframe for free"
			:index="nav"
			index-label="Pricing"
			scroll-href="#plans"
		>
			<template #lines>
				<UxHeroLine>Start using</UxHeroLine>
				<UxHeroLine>styleframe for <em class="ux-serif">free</em></UxHeroLine>
			</template>
			<template #lead>
				On top of all the core features and open source composables from
				styleframe, <strong>styleframe Pro</strong> gives you access to premium
				composables to create beautiful &amp; responsive Design Systems in
				minutes.
			</template>
		</UxHero>

		<SiteSection id="plans" index="01" role="Plans" title="Plans">
			<SitePricing />
		</SiteSection>

		<SiteSection
			id="faq"
			index="02"
			role="FAQ"
			title="Frequently Asked Questions"
		>
			<template #lead>
				If you can't find what you're looking for, email our support team and
				someone will get back to you.
			</template>

			<div class="faq">
				<section class="faq__group" aria-labelledby="general">
					<h3 id="general">General</h3>
					<details>
						<summary>
							What is the difference between styleframe and styleframe Pro?
						</summary>
						<p>
							Styleframe Pro is a
							<strong>collection of premium composables</strong>
							built on top of styleframe. It includes advanced features designed
							ot help you build web applications faster.
						</p>
					</details>
					<details>
						<summary>
							What does "Unlimited minor &amp; patch updates" include?
						</summary>
						<p>
							We add new composables and improvements to styleframe Pro as we
							get new ideas and feedback, you will receive these updates for the
							major version you purchased.
						</p>
						<p>
							Your license key will work forever for the major version you
							purchased. We may release a major version including more advanced
							components and features in the future, and you will be able to
							upgrade to this version with a generous discount.
						</p>
					</details>
					<details>
						<summary>What does "Lifetime access" mean exactly?</summary>
						<p>
							Buying a styleframe Pro license is a
							<strong>one-time purchase, with no recurring subscription</strong
							>. When you purchase a styleframe Pro license, you get access to
							everything in the current major version of styleframe Pro forever.
						</p>
					</details>
					<details>
						<summary>Do you have a free trial?</summary>
						<p>
							We have something much better than a free trial, you can use
							styleframe Pro for <strong>free in development mode</strong>. Once
							you are ready to deploy your application, you can purchase a
							license.
						</p>
					</details>
					<details>
						<summary>
							Do you offer discounts for students or non-profits?
						</summary>
						<p>
							Yes, we offer a <strong>50% discount</strong> for students and
							non-profits using styleframe Pro purely for educational purposes.
							Contact us at <a :href="support">support@styleframe.dev</a> with
							your details and we'll send you a discount code.
						</p>
					</details>
				</section>

				<section class="faq__group" aria-labelledby="license">
					<h3 id="license">License</h3>
					<details>
						<summary>Do I need a license for each project I work on?</summary>
						<p>
							One license, unlimited projects. With Styleframe Pro, you can
							build as many sites as you want without purchasing additional
							licenses.
						</p>
						<p>
							Use it for all your client work, personal projects, and SaaS
							applications — as long as they comply with our license terms. No
							per-project fees, no hidden costs.
						</p>
						<p>
							<NuxtLink :to="LICENSE_URL">Read our license</NuxtLink> for full
							details and examples.
						</p>
					</details>
					<details>
						<summary>Can I use styleframe Pro for client projects?</summary>
						<p>Yes! Styleframe Pro is perfect for client work:</p>
						<ul>
							<li>
								<strong>Single client projects</strong>: Use your license to
								build custom websites
							</li>
							<li>
								<strong>Multi-client templates</strong>: Each client needs their
								own license
							</li>
						</ul>
						<p>Build with confidence knowing you're properly licensed.</p>
						<p>
							<NuxtLink :to="LICENSE_URL">Read our license</NuxtLink> for full
							details and examples.
						</p>
					</details>
					<details>
						<summary>
							Can I use styleframe Pro for my own commercial projects?
						</summary>
						<p>
							Absolutely! Your license covers unlimited projects — from public
							websites to paid SaaS applications.
						</p>
						<p>
							The only restriction: you can't create website builders or tools
							that let users generate their own sites using Styleframe Pro
							components. Please contact
							<a :href="support">support@styleframe.dev</a> for more information
							about a Builder License. Everything else is fair game.
						</p>
						<p>
							<NuxtLink :to="LICENSE_URL">Read our license</NuxtLink> for full
							details and examples.
						</p>
					</details>
					<details>
						<summary>
							Can I use styleframe Pro for Open Source projects?
						</summary>
						<p>
							Yes, you can use styleframe Pro for your open source projects as
							well as your commercial projects as long as you don't sell
							styleframe Pro as a product and you don't share your license key.
						</p>
						<p>
							<NuxtLink :to="LICENSE_URL">Read our license</NuxtLink> for full
							details and examples.
						</p>
					</details>
					<details>
						<summary>
							Can I sell templates/themes I build with styleframe Pro?
						</summary>
						<p>
							Yes, you can use styleframe Pro to create derivative products like
							themes, UI kits, page builders, or anything else where you would
							be repackaging and redistributing our components or templates for
							someone else to use to build their own sites, but this will
							require a special Builder License. Contact
							<a :href="support">support@styleframe.dev</a>
							for more information.
						</p>
						<p>
							<NuxtLink :to="LICENSE_URL">Read our license</NuxtLink> for full
							details and examples.
						</p>
					</details>
					<details>
						<summary>
							Can I purchase an organization license that includes more than 20
							developers?
						</summary>
						<p>
							For organizations needing more than 20 seats, we offer two
							approaches:
						</p>
						<p>
							<strong>Multiple teams?</strong> Purchase separate team licenses
							for each division. For example, one for your storefront team,
							another for marketing, and another for data science.
						</p>
						<p>
							<strong>Single large team or organization?</strong> If you're an
							agency or unified organization without clear divisions, contact us
							at <a :href="support">support@styleframe.dev</a> for enterprise
							pricing.
						</p>
					</details>
				</section>

				<section class="faq__group" aria-labelledby="contents">
					<h3 id="contents">Contents</h3>
					<details>
						<summary>What do I get with my license?</summary>
						<p>
							Once you purchase a license, you will receive a
							<strong>license key</strong> to activate. The license key will
							allow you to build your project to production.
						</p>
					</details>
					<details>
						<summary>Are Figma, Sketch, or Adobe XD files included?</summary>
						<p>
							Design assets for Figma, Sketch, or Adobe XD are not included.
						</p>
						<p>
							We focus exclusively on delivering production-ready code
							components and templates. This allows us to provide more features,
							better documentation, and faster updates where it matters most —
							in your actual codebase.
						</p>
					</details>
				</section>

				<section class="faq__group" aria-labelledby="support">
					<h3 id="support">Support</h3>
					<details>
						<summary>Do you offer technical support?</summary>
						<p>
							Styleframe Pro is designed for developers comfortable with CSS and
							TypeScript. We provide support for account management and
							licensing questions, but expect you to have the technical skills
							needed to integrate our tools into your projects.
						</p>
						<p>
							While
							<strong>
								we don't provide project-specific technical support or
								consulting
							</strong>
							due to the unique nature of every codebase, our comprehensive
							<NuxtLink :to="INTRODUCTION_URL">documentation</NuxtLink> and
							active <a :href="DISCORD_URL">community forum</a> are here to help
							you succeed.
						</p>
					</details>
					<details>
						<summary>What is your refund policy?</summary>
						<p>
							If you are not satisfied with styleframe Pro, let us know within
							<strong>14 days</strong> of your purchase at
							<a :href="support">support@styleframe.dev</a> and we'll refund
							your money.
						</p>
					</details>
				</section>
			</div>
		</SiteSection>

		<UxFinale kicker="Pricing">
			<template #title
				>Start using styleframe for <em class="ux-serif">free</em>.</template
			>
			<template #actions>
				<UxPillLink :href="INTRODUCTION_URL" label="Get started for free" />
			</template>
			<template #footer><SiteFooter /></template>
		</UxFinale>
	</UxSite>
</template>

<style scoped>
.faq {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 2rem 2.5rem;
	color: var(--ux-fg-2);
}

.faq__group h3 {
	margin: 0 0 0.75rem;
	font-family: var(--font-ux-mono);
	font-size: 0.75rem;
	font-weight: 400;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--ux-fg-3);
}

.faq details {
	border-top: 1px solid var(--ux-line);
}

.faq details:last-child {
	border-bottom: 1px solid var(--ux-line);
}

.faq summary {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.9rem 0;
	font-weight: 500;
	line-height: 1.4;
	color: var(--ux-fg);
	cursor: pointer;
	list-style: none;
}

.faq summary::-webkit-details-marker {
	display: none;
}

.faq summary::after {
	content: "+";
	font-family: var(--font-ux-mono);
	color: var(--ux-fg-3);
}

.faq details[open] summary::after {
	content: "–";
}

.faq p,
.faq ul {
	margin: 0 0 0.9rem;
	font-size: 0.9375rem;
	line-height: 1.6;
}

.faq ul {
	padding-left: 1.25rem;
	list-style: disc;
}

.faq strong {
	font-weight: 500;
	color: var(--ux-fg);
}

.faq a {
	color: var(--ux-fg);
	text-decoration: underline;
	text-decoration-color: var(--ux-line-strong);
	text-underline-offset: 0.2em;
}

.faq a:hover {
	text-decoration-color: currentColor;
}

@media (max-width: 960px) {
	.faq {
		grid-template-columns: 1fr;
	}
}
</style>
