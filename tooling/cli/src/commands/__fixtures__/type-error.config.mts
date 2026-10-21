// A `.mts` file, so the package's own type check, which includes
// `src/**/*.ts`, leaves this deliberate type error alone
import { styleframe } from "@styleframe/core";

const s = styleframe();

s.utility("padding", ({ value }) => ({ padding: value }));
s.recipe({
	name: "button",
	base: {},
	variants: { size: { sm: { padding: "4px" }, md: { padding: "8px" } } },
	defaultVariants: { size: "medium" },
});

export default s;
