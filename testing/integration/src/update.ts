import fs from "node:fs";
import path from "node:path";

import { addStyleframeConfig, buildVite } from "./commands";

const __dirname = import.meta.filename;

const packageDir = path.join(__dirname, "..", "..");
const appDir = path.join(packageDir, ".app");

if (!fs.existsSync(appDir)) {
	console.error("Error: .app/ directory not found. Run 'pnpm run setup' first.");
	process.exit(1);
}

/**
 * 1. Re-copy fixture files
 */

addStyleframeConfig(packageDir, appDir);

/**
 * 2. Rebuild application
 */

buildVite(appDir);

console.log("\nUpdate complete! Run 'pnpm run test:e2e' to run tests.");
