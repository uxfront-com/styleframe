import type {
	Diagnostic,
	ShorteningMap,
	StyleframeOptions,
} from "@styleframe/core";

export type OutputFile = {
	name: string;
	content: string;
};

export type Output = {
	files: OutputFile[];
	/** Problems `validate()` found in the instance */
	diagnostics?: Diagnostic[];
};

export type TranspileContext = {
	treeshake?: boolean;
	scanner?: boolean;
	shortMap?: ShorteningMap;
};

export type ConsumeFunction = (
	instance: unknown,
	options: StyleframeOptions,
	context?: TranspileContext,
) => string;

export type TranspileOptions = {
	type?: "css" | "ts" | "dts" | "all";
	treeshake?: boolean;
	scanner?: boolean;
	minify?: boolean;
	minifyOptions?: {
		properties?: Record<string, string>;
		values?: Record<string, string>;
		modifiers?: Record<string, string>;
	};
	consumers?: {
		css: ConsumeFunction;
		ts: ConsumeFunction;
		dts: ConsumeFunction;
	};
};
