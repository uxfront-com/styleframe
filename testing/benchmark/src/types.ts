export type RecipeFunction = (props?: Record<string, string>) => string;
export type RecipeMap = Record<string, RecipeFunction>;
export type ClassMapper = (className: string) => string;

export type ComponentSection = {
	name: string;
	styleframe: (recipes: RecipeMap, mapClass: ClassMapper) => string;
	tailwind: () => string;
};

export type PageSpec = {
	name: string;
	styleframe: string;
	styleframeShorthand: string;
	tailwind: string;
};

export type SizeMeasurement = {
	rawHtmlBytes: number;
	rawCssBytes: number;
	gzippedHtmlBytes: number;
	gzippedCssBytes: number;
	gzippedTotalBytes: number;
	totalClasses: number;
	elementsWithClasses: number;
	avgClassesPerElement: number;
	p95ClassesPerElement: number;
};

export type TimingMeasurement = {
	iterations: Array<number>;
	median: number;
};

export type BenchmarkEntry = {
	label: string;
	htmlPath: string;
	cssPath: string;
	size: SizeMeasurement;
};

export type PageResult = {
	page: string;
	entries: Array<BenchmarkEntry>;
};

export type BenchmarkReport = {
	date: string;
	versions: {
		tailwind: string;
		styleframe: string;
		node: string;
	};
	visualParityPassed: boolean;
	entries: Array<BenchmarkEntry>;
	inProcessTiming: Record<string, TimingMeasurement>;
	cliColdTiming: Record<string, TimingMeasurement>;
};
