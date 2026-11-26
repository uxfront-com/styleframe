/**
 * Base error class for Styleframe plugin errors
 */
export class StyleframePluginError extends Error {
	constructor(message: string) {
		super(`[styleframe] ${message}`);
		this.name = "StyleframePluginError";
	}
}

/**
 * Thrown when two different files export the same name
 */
export class ExportCollisionError extends StyleframePluginError {
	constructor(exportName: string, source1: string, source2: string) {
		super(
			`Export collision: "${exportName}" is exported from both:\n` +
				`  - ${source1}\n` +
				`  - ${source2}\n\n` +
				`Rename one of the exports to resolve this collision.`,
		);
		this.name = "ExportCollisionError";
	}
}

/**
 * Thrown when trying to use the global instance before it's initialized
 */
export class GlobalInstanceNotInitializedError extends StyleframePluginError {
	constructor() {
		super(
			"Global instance not initialized. " +
				"Make sure styleframe.config.ts is loaded before *.styleframe.ts files.",
		);
		this.name = "GlobalInstanceNotInitializedError";
	}
}

/**
 * Thrown when a circular dependency is detected
 */
export class CircularDependencyError extends StyleframePluginError {
	constructor(filePath: string, chain: Array<string>) {
		super(`Circular dependency detected:\n` + `  ${chain.join(" -> ")} -> ${filePath}`);
		this.name = "CircularDependencyError";
	}
}
