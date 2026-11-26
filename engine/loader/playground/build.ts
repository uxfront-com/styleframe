import path from "node:path";
import { loadConfiguration } from "../src/config";
import { build } from "../src/build";

const __dirname = new URL(".", import.meta.url).pathname;

(async () => {
	const config = await loadConfiguration({ cwd: __dirname });

	await build(config, {
		outputDir: path.resolve(__dirname, "dist"),
	});
})();
