import { styleframe } from "@styleframe/core";
import { brand } from "./tokens";

const s = styleframe();

s.variable("color.brand", brand);

export default s;
