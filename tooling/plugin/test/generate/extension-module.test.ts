import { describe, expect, it } from "vitest";

import { generateExtensionModule } from "../../src/plugin/generate/extension-module";

describe("generateExtensionModule", () => {
	it("should generate module with config import", () => {
		const configPath = "/path/to/styleframe.config.ts";
		const result = generateExtensionModule(configPath);

		expect(result).toContain(`import config from '${configPath}'`);
	});

	it("should export styleframe function that returns config", () => {
		const result = generateExtensionModule("/any/path.ts");

		expect(result).toContain("export function styleframe()");
		expect(result).toContain("return config");
	});

	it("should export config as default", () => {
		const result = generateExtensionModule("/any/path.ts");

		expect(result).toContain("export default config");
	});

	it("should handle paths with special characters", () => {
		const configPath = "/path/with spaces/and-dashes/config.ts";
		const result = generateExtensionModule(configPath);

		expect(result).toContain(`import config from '${configPath}'`);
	});
});
