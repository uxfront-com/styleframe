import path from "node:path";
import {
	buildPackages,
	createPackageTarballs,
	createStarterVitePackage,
	installStyleframeUsingCLI,
	cleanup,
	addStyleframeConfig,
	buildVite,
} from "./commands";

const __dirname = import.meta.filename;

const packageDir = path.join(__dirname, "..", "..");
const workspaceDir = path.join(packageDir, "..", "..");
const appDir = path.join(packageDir, ".app");

/**
 * 1. Clean previous .app directory
 */

cleanup([appDir]);

/**
 * 2. Build styleframe packages
 */

buildPackages(workspaceDir);

/**
 * 3. Generate .tgz package files
 */

const packageToTarballMap = createPackageTarballs(workspaceDir, {
	filter: ["./engine/*", "./tooling/*", "./theme"],
});

/**
 * 4. Create starter vite package
 */

const viteProjectDir = createStarterVitePackage(packageDir, {
	outputDir: ".app",
});

console.log("Starter Vite package created at:", viteProjectDir);

/**
 * 5. Install styleframe using the CLI
 */

installStyleframeUsingCLI(viteProjectDir, packageToTarballMap);

/**
 * 6. Add styleframe config
 */

addStyleframeConfig(packageDir, viteProjectDir);

/**
 * 7. Build application
 */

buildVite(viteProjectDir);

console.log("\nSetup complete! The integration app is at:", viteProjectDir);
console.log("\nNext steps:");
console.log("  pnpm run test:e2e   — Run Playwright tests");
console.log("  pnpm run update     — Re-copy fixtures and rebuild");
