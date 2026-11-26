import path from "node:path";

import build from "../src/commands/build";

const __dirname = new URL(".", import.meta.url).pathname;

(async () => {
	await build.run?.({
		args: {
			entry: path.resolve(__dirname, "styleframe.config.ts"),
			outputDir: path.resolve(__dirname, "styleframe"),
		},
	} as any);
})();
