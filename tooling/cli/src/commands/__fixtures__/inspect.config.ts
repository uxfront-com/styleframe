import { styleframe } from "@styleframe/core";

const s = styleframe();

const colorBrand = s.variable("color.brand", "#6366f1");

s.theme("dark", (ctx) => {
	ctx.variable(colorBrand, "#818cf8");
});

const hover = s.modifier("hover", ({ declarations }) => ({
	"&:hover": declarations,
}));
const createBackgroundColor = s.utility(
	"background-color",
	({ value }) => ({ backgroundColor: value }),
	{ namespace: "color" },
);
createBackgroundColor({ brand: s.ref(colorBrand) }, [hover]);

s.recipe({
	name: "button",
	base: { backgroundColor: "@color.brand" },
	variants: { size: { sm: {}, md: {} } },
	defaultVariants: { size: "md" },
});

export default s;
