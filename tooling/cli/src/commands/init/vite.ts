import path from "node:path";

import consola from "consola";
import { loadFile as loadMagicastFile, writeFile as writeMagicastFile } from "magicast";
import { addVitePlugin } from "magicast/helpers";

import { DOCS_MANUAL_INSTALLATION_VITE_URL } from "../../constants";

export async function initializeViteFrameworkFile(cwd: string) {
	consola.success("Vite environment detected.");
	const configFilePath = path.join(cwd, "vite.config.ts");

	try {
		const mod = await loadMagicastFile(configFilePath);

		addVitePlugin(mod, {
			from: "styleframe/plugin/vite",
			constructor: "styleframe",
			imported: "default",
		});

		await writeMagicastFile(mod, configFilePath);

		consola.success(`Updated Vite config file.`);
	} catch (error) {
		consola.error(`Failed to update Vite config file.`);
		consola.log(error);
		console.log("");
		console.log("Please read the documentation for manually installing styleframe for Vite.");
		console.log(DOCS_MANUAL_INSTALLATION_VITE_URL);
	}
}
