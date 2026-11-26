import { mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { join, resolve } from "node:path";
import { extname } from "node:path";

import { chromium } from "playwright";

const ROOT = resolve(import.meta.dirname, "..");
const RESULTS = join(ROOT, "results");
const SCREENSHOTS = join(RESULTS, "screenshots");

const PAGES = ["dashboard", "marketing", "blog", "ecommerce", "settings"];
const VARIANTS = ["tailwind", "styleframe", "styleframe-shorthand", "styleframe-minified"];
const MIME: Record<string, string> = {
	".html": "text/html",
	".css": "text/css",
};

async function startServer(): Promise<{ port: number; close: () => void }> {
	return new Promise((resolve) => {
		const server = createServer((req, res) => {
			const filePath = join(RESULTS, decodeURIComponent(req.url ?? "/"));
			try {
				const content = readFileSync(filePath);
				res.writeHead(200, {
					"Content-Type": MIME[extname(filePath)] ?? "application/octet-stream",
					"Cache-Control": "no-store",
				});
				res.end(content);
			} catch {
				res.writeHead(404);
				res.end("Not found");
			}
		});
		server.listen(0, () => {
			const addr = server.address();
			const port = typeof addr === "object" ? addr!.port : 0;
			resolve({ port, close: () => server.close() });
		});
	});
}

async function main() {
	mkdirSync(SCREENSHOTS, { recursive: true });

	const server = await startServer();
	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: { width: 1280, height: 800 },
	});

	const failures: Array<string> = [];

	for (const page of PAGES) {
		console.log(`\n=== ${page} ===`);

		for (const variant of VARIANTS) {
			const htmlPath = join(RESULTS, page, variant, "index.html");
			try {
				readFileSync(htmlPath);
			} catch {
				console.log(`  ${variant}: SKIP (no build output)`);
				continue;
			}

			const tab = await context.newPage();
			await tab.goto(`http://localhost:${server.port}/${page}/${variant}/index.html`);
			await tab.waitForLoadState("networkidle");

			const screenshotPath = join(SCREENSHOTS, `${page}-${variant}.png`);
			await tab.screenshot({ fullPage: true, path: screenshotPath });
			console.log(`  ${variant}: screenshot saved`);
			await tab.close();
		}

		// Compare Tailwind vs Styleframe pixel diff
		const twPath = join(SCREENSHOTS, `${page}-tailwind.png`);
		const sfPath = join(SCREENSHOTS, `${page}-styleframe.png`);
		try {
			const twBuf = readFileSync(twPath);
			const sfBuf = readFileSync(sfPath);
			const sizeRatio = Math.min(twBuf.length, sfBuf.length) / Math.max(twBuf.length, sfBuf.length);
			console.log(
				`  parity: TW ${twBuf.length}B vs SF ${sfBuf.length}B (image size ratio: ${(sizeRatio * 100).toFixed(1)}%)`,
			);
			if (sizeRatio < 0.8) {
				failures.push(
					`${page}: image sizes differ significantly (${(sizeRatio * 100).toFixed(1)}%)`,
				);
			}
		} catch {
			failures.push(`${page}: could not compare screenshots`);
		}
	}

	await browser.close();
	server.close();

	console.log("\n=== SUMMARY ===");
	if (failures.length === 0) {
		console.log("All pages rendered. Open results/screenshots/ to visually inspect parity.");
	} else {
		console.log("Issues:");
		for (const f of failures) {
			console.log(`  - ${f}`);
		}
	}
	console.log(`\nScreenshots saved to: ${SCREENSHOTS}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
