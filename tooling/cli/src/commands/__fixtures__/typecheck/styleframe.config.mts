// Type-checks only with the `vite/client` types the tsconfig beside it names
import { styleframe } from "@styleframe/core";

const s = styleframe();

const mode: ImportMetaEnv["MODE"] = "production";
s.variable("mode", mode);

export default s;
