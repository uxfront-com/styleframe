import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
	buildPackages,
	createPackageTarballs,
	createStarterVitePackage,
	installStyleframeUsingCLI,
	cleanup,
	addStyleframeConfig,
	buildVite,
	runPlaywright,
} from "./commands";

const __dirname = import.meta.filename;

const packageDir = path.join(__dirname, "..", "..");
const workspaceDir = path.join(packageDir, "..", "..");

/**
 * 1. Build styleframe packages
 */

buildPackages(workspaceDir);

/**
 * 2. Generate .tgz package files
 */

const packageToTarballMap = createPackageTarballs(workspaceDir, {
	filter: ["./engine/*", "./tooling/*", "./theme"],
});

/**
 * 3. Create starter vite package
 */

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "styleframe-"));
const viteStyleframeCLIOutputDir = createStarterVitePackage(tempDir);

console.log("Starter Vite package created at:", viteStyleframeCLIOutputDir);

/**
 * 4. Install styleframe using the CLI
 */

installStyleframeUsingCLI(viteStyleframeCLIOutputDir, packageToTarballMap);

/**
 * 5. Add styleframe config
 */

addStyleframeConfig(packageDir, viteStyleframeCLIOutputDir);

/**
 * 6. Build application
 */

buildVite(viteStyleframeCLIOutputDir);

/**
 * 7. Run playwright tests
 */

runPlaywright(packageDir, viteStyleframeCLIOutputDir);

/**
 * Cleanup
 */
cleanup([viteStyleframeCLIOutputDir]);
