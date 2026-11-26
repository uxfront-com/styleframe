import { styleframe } from "@styleframe/core";

const s = styleframe();
const { theme, variable, ref, selector, modifier, utility } = s;

const colorPrimary = variable("color--primary", "#007bff");
const colorSecondary = variable("color--secondary", "#6c757d");

const cardBackground = variable("card--background", "#ffffff");
const cardColor = variable("card--color", "#000000");

selector(".card", {
	background: ref(cardBackground),
	color: ref(cardColor),
});

theme("dark", (ctx) => {
	ctx.variable(cardBackground, "#18181b");
	ctx.variable(cardColor, "#ffffff");

	ctx.selector(".card", {
		border: ctx.css`1px solid ${ctx.ref(cardBackground)}`,
	});
});

theme("sepia", (ctx) => {
	ctx.variable(cardBackground, "#f5f5dc");
	ctx.variable(cardColor, "#333333");
});

const hover = modifier("hover", ({ declarations, variables, children, selector }) => {
	selector("&:hover", { declarations, variables, children });
});

const createBackgroundUtility = utility("background", ({ value }) => ({
	background: value,
}));

createBackgroundUtility(
	{
		primary: ref(colorPrimary),
		secondary: ref(colorSecondary),
	},
	[hover],
);

export default s;
