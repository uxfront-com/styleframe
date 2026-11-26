import path from "node:path";

import consola from "consola";
import { loadFile as loadMagicastFile, writeFile as writeMagicastFile } from "magicast";
import { addNuxtModule } from "magicast/helpers";

import { DOCS_MANUAL_INSTALLATION_NUXT_URL } from "../../constants";

export async function initializeNuxtFrameworkFile(cwd: string) {
	consola.success("Nuxt environment detected.");
	const configFilePath = path.join(cwd, "nuxt.config.ts");

	try {
		const mod = await loadMagicastFile(configFilePath);

		addNuxtModule(mod, "styleframe/plugin/nuxt", "styleframe");

		await writeMagicastFile(mod, configFilePath);

		consola.success(`Updated Nuxt config file.`);
	} catch (error) {
		consola.error(`Failed to update Nuxt config file.`);
		consola.log(error);
		console.log("");
		console.log("Please read the documentation for manually installing styleframe for Nuxt.");
		console.log(DOCS_MANUAL_INSTALLATION_NUXT_URL);
	}
}
