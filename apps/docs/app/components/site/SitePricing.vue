<script setup lang="ts">
import { INTRODUCTION_URL } from "~/data/site";

// The plans, as main's pricing-plans components had them: the community plan,
// the Pro tiers with their comparison, and Pro's free development mode.
const community = [
	"All styleframe core features",
	"40+ composables",
	"Unlimited developers",
	"Unlimited projects",
	"Unlimited major, patch & minor updates",
	"Lifetime access",
];

const tiers = [
	{
		id: "solo",
		title: "Solo",
		price: "$149",
		description: "For indie hackers, freelancers and solo founders.",
		billingPeriod: "one-time payment",
		billingCycle: "plus local taxes",
		button: {
			label: "Buy now",
			to: "https://buy.polar.sh/polar_cl_Emg2oNVEHjBUEHvxleSZxjHaCmlT9fgYtrACU4QVLUm",
		},
	},
	{
		id: "startup",
		title: "Startup",
		price: "$499",
		description: "For small teams, startups and agencies.",
		billingPeriod: "one-time payment",
		billingCycle: "plus local taxes",
		button: {
			label: "Buy now",
			to: "https://buy.polar.sh/polar_cl_IiKynjOnqr8efgtVhbSaNSvWt6G6LbHW2Oqpq4KLobS",
		},
		highlight: true,
	},
	{
		id: "organization",
		title: "Organization",
		price: "Custom",
		description: "For growing teams and large organizations.",
		button: {
			label: "Contact sales",
			to: "mailto:hello@styleframe.dev?subject=Enterprise License Inquiry",
		},
	},
] as const;

type TierId = (typeof tiers)[number]["id"];

const features: { title: string; tiers: Record<TierId, string | boolean> }[] = [
	{
		title: "Number of developers",
		tiers: { solo: "1", startup: "5", organization: "Unlimited" },
	},
	{
		title: "Unlimited Projects",
		tiers: { solo: true, startup: true, organization: true },
	},
	{
		title: "All styleframe Pro features",
		tiers: { solo: true, startup: true, organization: true },
	},
	{
		title: "Access to the Pro GitHub repository",
		tiers: { solo: true, startup: true, organization: true },
	},
	{
		title: "Unlimited minor & patch updates",
		tiers: { solo: true, startup: true, organization: true },
	},
	{
		title: "Lifetime access",
		tiers: { solo: true, startup: true, organization: true },
	},
	{
		title: "Prioritized feature requests",
		tiers: { solo: false, startup: false, organization: true },
	},
	{
		title: "Support",
		tiers: { solo: "Standard", startup: "Priority", organization: "Dedicated" },
	},
];
</script>

<template>
	<div class="site-pricing">
		<div class="site-pricing__plan">
			<div>
				<h3>Community</h3>
				<p>Our community version is open-source and free to use. Forever.</p>
			</div>
			<ul class="site-pricing__list">
				<li v-for="feature in community" :key="feature">{{ feature }}</li>
			</ul>
			<div class="site-pricing__cta">
				<p class="site-pricing__price">Free</p>
				<UxPillLink :href="INTRODUCTION_URL" label="Get started for free" />
			</div>
		</div>

		<div class="site-pricing__table">
			<table>
				<caption class="ux-sr-only">
					styleframe Pro plans
				</caption>
				<thead>
					<tr>
						<td />
						<th
							v-for="tier in tiers"
							:key="tier.id"
							scope="col"
							:class="{ 'is-highlight': 'highlight' in tier }"
						>
							<span class="site-pricing__tier">{{ tier.title }}</span>
							<span
								class="site-pricing__description"
								>{{ tier.description }}</span
							>
							<span class="site-pricing__price">{{ tier.price }}</span>
							<span
								v-if="'billingPeriod' in tier"
								class="site-pricing__billing"
							>
								<span>{{ tier.billingPeriod }}</span>
								<span>{{ tier.billingCycle }}</span>
							</span>
							<UxPillLink :href="tier.button.to" :label="tier.button.label" />
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="feature in features" :key="feature.title">
						<th scope="row">{{ feature.title }}</th>
						<td v-for="tier in tiers" :key="tier.id">
							<template v-if="typeof feature.tiers[tier.id] === 'string'">
								{{ feature.tiers[tier.id] }}
							</template>
							<template v-else-if="feature.tiers[tier.id]">
								<span aria-hidden="true">✓</span>
								<span class="ux-sr-only">Included</span>
							</template>
							<template v-else>
								<span aria-hidden="true" class="site-pricing__no">–</span>
								<span class="ux-sr-only">Not included</span>
							</template>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="site-pricing__plan">
			<div>
				<h3>Free in Development</h3>
				<p>
					Try styleframe Pro for free in development, no credit card required.
					Upgrade when ready to deploy.
				</p>
			</div>
			<div class="site-pricing__cta">
				<UxPillLink :href="INTRODUCTION_URL" label="Get started for free" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.site-pricing {
	display: grid;
	gap: 1.5rem;
	color: var(--ux-fg-2);
}

.site-pricing h3 {
	margin: 0 0 0.5rem;
	font-size: 1.5rem;
	font-weight: 500;
	letter-spacing: -0.03em;
	color: var(--ux-fg);
}

.site-pricing p {
	margin: 0;
}

.site-pricing__plan {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) auto;
	align-items: center;
	gap: 1.5rem 2rem;
	padding: 1.5rem;
	border: 1px solid var(--ux-line);
	border-radius: 6px;
	background: rgb(255 255 255 / 0.03);
}

.site-pricing__plan:last-child {
	grid-template-columns: minmax(0, 1fr) auto;
}

.site-pricing__list {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.4rem 1.5rem;
	margin: 0;
	padding: 0;
	list-style: none;
	font-size: 0.875rem;
}

.site-pricing__list li::before {
	content: "✓ ";
	color: var(--ux-fg);
}

.site-pricing__cta {
	display: grid;
	justify-items: end;
	gap: 0.75rem;
}

.site-pricing__price {
	font-size: 2rem;
	font-weight: 500;
	letter-spacing: -0.04em;
	color: var(--ux-fg);
}

.site-pricing__table {
	overflow-x: auto;
	border: 1px solid var(--ux-line);
	border-radius: 6px;
}

.site-pricing table {
	width: 100%;
	min-width: 44rem;
	border-collapse: collapse;
	font-size: 0.875rem;
}

.site-pricing :is(th, td) {
	padding: 0.85rem 1rem;
	text-align: left;
	vertical-align: top;
	border-bottom: 1px solid var(--ux-line);
}

.site-pricing tbody tr:last-child :is(th, td) {
	border-bottom: 0;
}

.site-pricing tbody th {
	font-weight: 400;
	color: var(--ux-fg-2);
}

.site-pricing tbody td {
	color: var(--ux-fg);
}

.site-pricing thead th {
	width: 24%;
	padding: 1.5rem 1rem;
	font-weight: 400;
}

.site-pricing thead th.is-highlight {
	background: rgb(255 255 255 / 0.05);
	box-shadow: inset 0 2px 0 var(--ux-fg);
}

.site-pricing thead th > span {
	display: block;
}

.site-pricing__tier {
	margin-bottom: 0.4rem;
	font-size: 1.25rem;
	font-weight: 500;
	letter-spacing: -0.02em;
	color: var(--ux-fg);
}

.site-pricing__description {
	min-height: 2.6rem;
	margin-bottom: 1rem;
	color: var(--ux-fg-2);
}

.site-pricing__billing {
	margin: 0.25rem 0 1.25rem;
	font-family: var(--font-ux-mono);
	font-size: 0.75rem;
	color: var(--ux-fg-3);
}

.site-pricing__billing > span {
	display: block;
}

.site-pricing__no {
	color: var(--ux-fg-3);
}

@media (max-width: 960px) {
	.site-pricing__plan,
	.site-pricing__plan:last-child {
		grid-template-columns: 1fr;
	}

	.site-pricing__cta {
		justify-items: start;
	}
}

@media (max-width: 560px) {
	.site-pricing__list {
		grid-template-columns: 1fr;
	}
}
</style>
