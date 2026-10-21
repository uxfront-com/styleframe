import { styleframe } from "@styleframe/core";

const s = styleframe();

s.variable("color.brand", "#6366f1");
s.selector(".card", { color: s.ref("color.brnad") });

export default s;
