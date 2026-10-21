export type DiagnosticCode =
	| "unresolved-reference"
	| "undefined-theme-override"
	| "duplicate-variable";

export type DiagnosticSeverity = "error" | "warning";

export type Diagnostic = {
	code: DiagnosticCode;
	severity: DiagnosticSeverity;
	message: string;
	/** Where the problem was made, e.g. `recipe "button" › base › background` */
	path: string;
	/** The nearest registered variable name, when one is within edit distance 2 */
	suggestion?: string;
};
