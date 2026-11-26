// lighthouserc.mjs on a desktop screen and network.
import { lighthouseConfig } from "@uxfront/site-checks/lighthouse";

import { collect, matrix } from "./lighthouserc.mjs";

export default lighthouseConfig({
	collect: { ...collect, settings: { preset: "desktop" } },
	matrix,
});
