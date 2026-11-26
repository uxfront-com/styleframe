<script setup lang="ts">
const screenWidth = ref(992);

// Fluid viewport configuration
const minViewport = 320;
const maxViewport = 1440;

// Base font size range (min to max)
const baseFontSizeMin = 16;
const baseFontSizeMax = 18;

// Scale ratios for different viewport sizes
// Using Minor Third (1.2) for mobile and Major Third (1.25) for desktop
const scaleMin = 1.2;
const scaleMax = 1.25;

// Calculate fluid breakpoint variable based on current screen width
const fluidBreakpoint = computed(() => {
	const viewport = Math.max(
		minViewport,
		Math.min(maxViewport, screenWidth.value),
	);
	return (viewport - minViewport) / (maxViewport - minViewport);
});

// Calculate fluid font size using clamp-like logic
const calculateFluidSize = (min: number, max: number) => {
	const diff = max - min;
	return min + diff * fluidBreakpoint.value;
};

// Calculate scale powers
const getScalePower = (power: number, isMin: boolean) => {
	const scale = isMin ? scaleMin : scaleMax;
	return Math.pow(scale, power);
};

// Helper to calculate fluid font size for a given scale power
const getFluidFontSize = (scalePower: number) => {
	const min = baseFontSizeMin * getScalePower(scalePower, true);
	const max = baseFontSizeMax * getScalePower(scalePower, false);
	return calculateFluidSize(min, max);
};

// Generate fluid font sizes for different text elements
const fluidFontSizes = computed(() => {
	const h1Size = getFluidFontSize(4);
	const pSize = getFluidFontSize(0);
	const cardSize = getFluidFontSize(-1);
	return {
		"--fluid-h1-size": `${h1Size}px`,
		"--fluid-p-size": `${pSize}px`,
		"--fluid-card-size": `${cardSize}px`,
		"--fluid-breakpoint": fluidBreakpoint.value,
	};
});

// Format viewport width display
const viewportLabel = computed(() => {
	if (screenWidth.value <= 576) {return "Mobile";}
	if (screenWidth.value <= 768) {return "Tablet";}
	if (screenWidth.value <= 992) {return "Laptop";}
	return "Desktop";
});

// Calculate actual font sizes for display
</script>

<template>
	<div
		class="fluid-responsive-design-demo relative flex flex-col items-center mx-2"
	>
		<BrowserFrame
			title="Fluid Responsive Design - styleframe Pro"
			:style="{ width: `${screenWidth}px` }"
			class="mb-6 max-w-full bg-gradient-to-br from-slate-300/80 via-slate-300/50 to-slate-300/10 dark:from-slate-800/10 dark:via-slate-800/40 dark:to-slate-800/10"
		>
			<div
				class="h-[420px] pt-8 flex flex-col gap-8 max-sm:px-0"
				:class="{
          'px-0': screenWidth < 576,
          'px-8': screenWidth >= 576,
        }"
				:style="fluidFontSizes"
			>
				<!-- The sample page's headline, not a heading of the docs page, which
				     has its own <h1>. -->
				<p
					class="font-extrabold text-center mx-auto"
					style="font-size: var(--fluid-h1-size); line-height: 1.1"
				>
					Typography that flows naturally across every screen size
				</p>
				<p
					class="font-medium text-center mx-auto"
					style="font-size: var(--fluid-p-size); line-height: 1.6"
				>
					Say goodbye to cluttered breakpoint logic. Styleframe's fluid
					responsive design automatically scales your typography and spacing
					using mathematical precision.
				</p>
				<div
					class="cards flex gap-4 max-sm:flex-col"
					:class="screenWidth < 768 ? 'flex-col' : 'flex-row'"
				>
					<div
						class="card bg-white/20 border border-white/60 p-5 rounded-lg flex-1 dark:bg-slate-700/15 dark:border-slate-500/20"
						style="font-size: var(--fluid-card-size); line-height: 1.5"
					>
						<div class="font-bold mb-2">Step 1</div>
						<div>Define your minimum scale for mobile viewports</div>
					</div>
					<div
						class="card bg-white/20 border border-white/60 p-5 rounded-lg flex-1 dark:bg-slate-700/15 dark:border-slate-500/20"
						style="font-size: var(--fluid-card-size); line-height: 1.5"
					>
						<div class="font-bold mb-2">Step 2</div>
						<div>Set your maximum scale for desktop displays</div>
					</div>
					<div
						class="card bg-white/20 border border-white/60 p-5 rounded-lg flex-1 dark:bg-slate-700/15 dark:border-slate-500/20"
						style="font-size: var(--fluid-card-size); line-height: 1.5"
					>
						<div class="font-bold mb-2">Step 3</div>
						<div>Watch as everything scales fluidly in between</div>
					</div>
				</div>
			</div>
		</BrowserFrame>

		<UCard class="w-[560px] max-w-full mt-[-100px] z-1">
			<template #header>
				<div class="flex justify-between items-center">
					<!-- A label for the controls, not a heading of the docs page. -->
					<p class="u-h3 font-bold">Interactive Controls</p>
					<div class="flex gap-2">
						<UBadge
							color="primary"
							variant="subtle"
							class="text-primary-700 dark:text-primary"
						>
							{{ screenWidth }}px
						</UBadge>
						<UBadge
							color="primary"
							variant="subtle"
							class="text-primary-700 dark:text-primary"
						>
							{{ viewportLabel }}
						</UBadge>
					</div>
				</div>
			</template>

			<div>
				<div
					class="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400"
				>
					<span>{{ minViewport }}px</span>
					<span>{{ maxViewport }}px</span>
				</div>
				<USlider
					:min="minViewport"
					:max="maxViewport"
					v-model="screenWidth"
					aria-label="Adjust viewport width"
				/>

				<div
					class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400"
				>
					<span>Mobile</span>
					<span>Tablet</span>
					<span>Laptop</span>
					<span>Desktop</span>
				</div>
			</div>
		</UCard>
	</div>
</template>

<style scoped>
.fluid-responsive-design-demo {
  --fluid-h1-size: 24px;
  --fluid-p-size: 16px;
  --fluid-card-size: 14px;
  --fluid-breakpoint: 0;
}
</style>
