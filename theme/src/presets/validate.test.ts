import { styleframe, validate } from "@styleframe/core";

import { useDesignTokensPreset } from "./useDesignTokensPreset";
import { useModifiersPreset } from "./useModifiersPreset";
import { useUtilitiesPreset } from "./useUtilitiesPreset";

describe("validate with every preset and a recipe", () => {
	it("reports no diagnostics", () => {
		const s = styleframe();
		useDesignTokensPreset(s);
		useModifiersPreset(s);
		useUtilitiesPreset(s);

		s.recipe({
			name: "example-button",
			base: {
				display: "inline-flex",
				alignItems: "center",
				borderWidth: "@border-width.thin",
				borderStyle: "@border-style.solid",
				borderRadius: "@border-radius.md",
				paddingBlock: "@0.5",
				paddingInline: "@0.75",
				fontSize: "@font-size.sm",
			},
			variants: {
				color: {
					primary: {
						background: "@color.primary",
						color: "@color.white",
						borderColor: "@color.primary",
						"&:hover": { background: "@color.primary-shade-50" },
					},
					neutral: {
						background: "@color.surface",
						color: "@color.text",
						borderColor: "@color.gray-200",
					},
				},
			},
			defaultVariants: { color: "primary" },
		});

		expect(s.root.recipes).toHaveLength(1);
		expect(validate(s)).toEqual([]);
	});
});
