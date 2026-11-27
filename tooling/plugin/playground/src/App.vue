<script setup lang="ts">
import { onMounted } from "vue";
import {
	button,
	badge,
	callout,
	calloutIcon,
	calloutContent,
	calloutTitle,
	calloutDescription,
	calloutDismiss,
	playgroundButtonRecipe,
	playgroundBadgeRecipe,
	playgroundCalloutRecipe,
	avatarRecipe,
	cardSelector,
} from "virtual:styleframe";

// --- Data ---

const buttonColors = ["primary", "secondary", "success", "error"] as const;
const buttonVariants = ["solid", "outline", "ghost"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

const badgeColors = [
	"primary",
	"secondary",
	"success",
	"warning",
	"error",
	"info",
] as const;

const badgeSizes = ["sm", "md", "lg"] as const;

const alertColors = ["success", "warning", "error", "info"] as const;

const alertConfig: Record<
	string,
	{ icon: string; title: string; message: string }
> = {
	success: {
		icon: "\u2713",
		title: "Success",
		message: "Your changes have been saved successfully.",
	},
	warning: {
		icon: "\u26A0",
		title: "Warning",
		message: "Your session will expire in 5 minutes.",
	},
	error: {
		icon: "\u2715",
		title: "Error",
		message: "There was a problem processing your request.",
	},
	info: {
		icon: "\u2139",
		title: "Information",
		message: "A new version is available. Refresh to update.",
	},
};

const avatarSizes = ["xs", "sm", "md", "lg", "xl"] as const;
const avatarInitials = ["A", "B", "C", "D", "E"];
const avatarShapes = ["circle", "rounded", "square"] as const;

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Debug logging ---

onMounted(() => {
	console.log("button():", button());
	console.log(
		'button({ color: "error", variant: "outline" }):',
		button({ color: "error", variant: "outline" }),
	);
	console.log("badge():", badge());
	console.log("callout():", callout());
	console.log("playgroundButtonRecipe():", playgroundButtonRecipe());
	console.log("playgroundBadgeRecipe():", playgroundBadgeRecipe());
	console.log("playgroundCalloutRecipe():", playgroundCalloutRecipe());
	console.log("avatarRecipe():", avatarRecipe());
	console.log("cardSelector:", cardSelector);
});
</script>

<template>
	<!-- Navbar -->
	<nav class="navbar">
		<a class="navbar__brand" href="#">Styleframe</a>
		<div class="navbar__nav">
			<a class="navbar__link navbar__link--active" href="#">Components</a>
			<a class="navbar__link" href="#">Tokens</a>
			<a class="navbar__link" href="#">Utilities</a>
		</div>
	</nav>

	<main class="_padding:xl" style="max-width: 1200px; margin-inline: auto">
		<!-- Page Header -->
		<header class="_margin-bottom:2xl">
			<h1 class="_font-size:4xl _font-weight:bold _margin:[0] _margin-bottom:xs">
				Component Showcase
			</h1>
			<p class="_font-size:lg _color:secondary _margin:[0]">
				Real-world components built with Styleframe recipes, selectors, and utilities.
			</p>
		</header>

		<!-- Buttons -->
		<section class="_margin-bottom:2xl">
			<h2 class="_font-size:2xl _font-weight:semibold _margin:[0] _margin-bottom:lg">Buttons</h2>

			<template v-for="variant in buttonVariants" :key="variant">
				<h3
					class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm"
				>
					{{ capitalize(variant) }}
				</h3>
				<div class="_display:flex _flex-wrap:wrap _gap:sm _align-items:center _margin-bottom:lg">
					<button
						v-for="color in buttonColors"
						:key="color"
						type="button"
						:class="button({ color, variant })"
					>
						{{ capitalize(color) }}
					</button>
				</div>
			</template>

			<h3 class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm">
				Sizes
			</h3>
			<div class="_display:flex _flex-wrap:wrap _gap:sm _align-items:center _margin-bottom:lg">
				<button v-for="size in buttonSizes" :key="size" type="button" :class="button({ size })">
					Size {{ size.toUpperCase() }}
				</button>
			</div>

			<h3 class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm">
				Disabled
			</h3>
			<div class="_display:flex _flex-wrap:wrap _gap:sm _align-items:center">
				<button type="button" :class="button()" disabled>Disabled Solid</button>
				<button type="button" :class="button({ variant: 'outline' })" disabled>
					Disabled Outline
				</button>
				<button type="button" :class="button({ variant: 'ghost' })" disabled>Disabled Ghost</button>
			</div>
		</section>

		<!-- Badges -->
		<section class="_margin-bottom:2xl">
			<h2 class="_font-size:2xl _font-weight:semibold _margin:[0] _margin-bottom:lg">Badges</h2>

			<h3 class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm">
				Solid
			</h3>
			<div class="_display:flex _flex-wrap:wrap _gap:sm _align-items:center _margin-bottom:lg">
				<span v-for="color in badgeColors" :key="color" :class="badge({ color })">
					{{ capitalize(color) }}
				</span>
			</div>

			<h3 class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm">
				Outline
			</h3>
			<div class="_display:flex _flex-wrap:wrap _gap:sm _align-items:center _margin-bottom:lg">
				<span
					v-for="color in badgeColors"
					:key="color"
					:class="badge({ color, variant: 'outline' })"
				>
					{{ capitalize(color) }}
				</span>
			</div>

			<h3 class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm">
				Sizes
			</h3>
			<div class="_display:flex _flex-wrap:wrap _gap:sm _align-items:center">
				<span v-for="size in badgeSizes" :key="size" :class="badge({ size })">
					{{ size.toUpperCase() }}
				</span>
			</div>
		</section>

		<!-- Cards -->
		<section class="_margin-bottom:2xl">
			<h2 class="_font-size:2xl _font-weight:semibold _margin:[0] _margin-bottom:lg">Cards</h2>
			<div
				class="_display:grid _gap:lg"
				style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
			>
				<div class="card">
					<div class="card__header">
						<h3 class="card__title">Getting Started</h3>
					</div>
					<div class="card__body">
						<p class="card__description">
							Create type-safe, composable CSS with Styleframe's design token system. Define
							variables, selectors, utilities, and recipes.
						</p>
					</div>
					<div class="card__footer">
						<button type="button" :class="button({ variant: 'ghost' })">Learn More</button>
					</div>
				</div>

				<div class="card">
					<div class="card__header">
						<h3 class="card__title">Design Tokens</h3>
					</div>
					<div class="card__body">
						<p class="card__description">
							Manage colors, spacing, typography, and more with a unified token system. Tokens
							cascade through themes and breakpoints.
						</p>
					</div>
					<div class="card__footer">
						<button type="button" :class="button({ variant: 'ghost' })">Explore Tokens</button>
					</div>
				</div>

				<div class="card">
					<div class="card__header">
						<h3 class="card__title">Recipe System</h3>
					</div>
					<div class="card__body">
						<p class="card__description">
							Build component variants with recipes. Combine base styles, variants, and compound
							variants for complete component APIs.
						</p>
					</div>
					<div class="card__footer">
						<button type="button" :class="button({ variant: 'ghost' })">View Recipes</button>
					</div>
				</div>
			</div>
		</section>

		<!-- Alerts / Callouts -->
		<section class="_margin-bottom:2xl">
			<h2 class="_font-size:2xl _font-weight:semibold _margin:[0] _margin-bottom:lg">Alerts</h2>
			<div class="_display:flex _flex-direction:column _gap:md">
				<div v-for="color in alertColors" :key="color" :class="callout({ color })" role="alert">
					<span :class="calloutIcon()" aria-hidden="true">{{ alertConfig[color].icon }}</span>
					<div :class="calloutContent()">
						<div :class="calloutTitle()">{{ alertConfig[color].title }}</div>
						<div :class="calloutDescription()">{{ alertConfig[color].message }}</div>
					</div>
					<button type="button" :class="calloutDismiss()" aria-label="Dismiss">&times;</button>
				</div>
			</div>
		</section>

		<!-- Avatars -->
		<section class="_margin-bottom:2xl">
			<h2 class="_font-size:2xl _font-weight:semibold _margin:[0] _margin-bottom:lg">Avatars</h2>

			<h3 class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm">
				Sizes
			</h3>
			<div class="_display:flex _flex-wrap:wrap _gap:md _align-items:end _margin-bottom:lg">
				<div
					v-for="(size, i) in avatarSizes"
					:key="size"
					:class="`avatar ${avatarRecipe({ size })}`"
				>
					{{ avatarInitials[i] }}
				</div>
			</div>

			<h3 class="_font-size:md _font-weight:medium _color:secondary _margin:[0] _margin-bottom:sm">
				Shapes
			</h3>
			<div class="_display:flex _flex-wrap:wrap _gap:md _align-items:center">
				<div
					v-for="shape in avatarShapes"
					:key="shape"
					:class="`avatar ${avatarRecipe({ size: 'lg', shape })}`"
				>
					{{ shape[0].toUpperCase() }}
				</div>
			</div>
		</section>

		<!-- Inputs -->
		<section class="_margin-bottom:2xl">
			<h2 class="_font-size:2xl _font-weight:semibold _margin:[0] _margin-bottom:lg">Inputs</h2>
			<div
				class="_display:grid _gap:lg"
				style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
			>
				<div class="input-group">
					<label class="input-group__label">Email</label>
					<input class="input-group__input" type="email" placeholder="you@example.com" />
					<p class="input-group__helper">We'll never share your email.</p>
				</div>

				<div class="input-group">
					<label class="input-group__label">Password</label>
					<input class="input-group__input" type="password" placeholder="Enter your password" />
				</div>

				<div class="input-group">
					<label class="input-group__label">Username</label>
					<input
						class="input-group__input"
						type="text"
						placeholder="Choose a username"
						value="taken_name"
					/>
					<p class="input-group__error">This username is already taken.</p>
				</div>

				<div class="input-group">
					<label class="input-group__label">Disabled Field</label>
					<input class="input-group__input" type="text" placeholder="Can't edit this" disabled />
				</div>
			</div>
		</section>

		<!-- Dark Theme Preview -->
		<section class="_margin-bottom:2xl">
			<h2 class="_font-size:2xl _font-weight:semibold _margin:[0] _margin-bottom:lg">Dark Theme</h2>
			<div
				data-theme="dark"
				class="_padding:xl _border-radius:lg"
				style="background: var(--color--background)"
			>
				<div
					class="_display:grid _gap:lg"
					style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))"
				>
					<div class="card">
						<div class="card__header">
							<h3 class="card__title">Dark Card</h3>
						</div>
						<div class="card__body">
							<p class="card__description">
								This card inherits the dark theme automatically through CSS custom properties.
							</p>
						</div>
						<div class="card__footer">
							<button type="button" :class="button({ color: 'primary' })">Primary</button>
							<button type="button" :class="button({ color: 'primary', variant: 'outline' })">
								Outline
							</button>
						</div>
					</div>

					<div class="card">
						<div class="card__body">
							<div class="input-group">
								<label class="input-group__label">Dark Input</label>
								<input class="input-group__input" type="text" placeholder="Type here..." />
								<p class="input-group__helper">Inputs adapt to the dark theme automatically.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Inspect Link -->
		<div class="_padding:lg _text-align:center">
			<a
				href="/__inspect/#/module?id=./src/main.ts&index=2"
				target="_blank"
				class="_color:primary _font-size:sm"
				style="text-decoration: none"
			>
				Open Inspector to view generated CSS
			</a>
		</div>
	</main>
</template>
