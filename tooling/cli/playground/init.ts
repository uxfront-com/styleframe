import { copyFile } from "node:fs/promises";
import path from "node:path";

import init from "../src/commands/init";

const __dirname = new URL(".", import.meta.url).pathname;

(async () => {
	await copyFile(
		path.join(__dirname, "package.template.json"),
		path.join(__dirname, "package.json"),
	);

	await copyFile(
		path.join(__dirname, "vite.config.template.ts"),
		path.join(__dirname, "vite.config.ts"),
	);

	await init.run?.({ args: { cwd: __dirname } } as any);
})();
