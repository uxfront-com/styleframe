import { styleframe } from "@styleframe/core";
import { useDarkModifier } from "../../modifiers/useMediaPreferenceModifiers";
import { useDrawerBodyRecipe } from "./index";

function createInstance() {
	const s = styleframe();
	for (const name of [
		"display",
		"flexDirection",
		"flexGrow",
		"gap",
		"paddingTop",
		"paddingBottom",
		"paddingLeft",
		"paddingRight",
		"flexShrink",
		"minHeight",
		"overflowY",
		"paddingInlineStart",
		"paddingInlineEnd",
	]) {
		s.utility(name, ({ value }) => ({ [name]: value }));
	}
	useDarkModifier(s);
	return s;
}

describe("useDrawerBodyRecipe", () => {
	it("namespaces the recipe to drawer with no separators", () => {
		const s = createInstance();
		const recipe = useDrawerBodyRecipe(s);

		expect(recipe.name).toBe("drawer-body");
		expect(recipe.compoundVariants ?? []).toHaveLength(0);
	});
});
