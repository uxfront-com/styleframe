import { createUseUtility } from "../../utils";

/**
 * Create scroll-margin utility classes.
 */
export const useScrollMarginUtility = createUseUtility("scroll-margin", ({ value }) => ({
	scrollMargin: value,
}));

/**
 * Create scroll-margin-x utility classes.
 */
export const useScrollMarginXUtility = createUseUtility("scroll-margin-x", ({ value }) => ({
	scrollMarginLeft: value,
	scrollMarginRight: value,
}));

/**
 * Create scroll-margin-y utility classes.
 */
export const useScrollMarginYUtility = createUseUtility("scroll-margin-y", ({ value }) => ({
	scrollMarginTop: value,
	scrollMarginBottom: value,
}));

/**
 * Create scroll-margin-top utility classes.
 */
export const useScrollMarginTopUtility = createUseUtility("scroll-margin-top", ({ value }) => ({
	scrollMarginTop: value,
}));

/**
 * Create scroll-margin-right utility classes.
 */
export const useScrollMarginRightUtility = createUseUtility("scroll-margin-right", ({ value }) => ({
	scrollMarginRight: value,
}));

/**
 * Create scroll-margin-bottom utility classes.
 */
export const useScrollMarginBottomUtility = createUseUtility(
	"scroll-margin-bottom",
	({ value }) => ({
		scrollMarginBottom: value,
	}),
);

/**
 * Create scroll-margin-left utility classes.
 */
export const useScrollMarginLeftUtility = createUseUtility("scroll-margin-left", ({ value }) => ({
	scrollMarginLeft: value,
}));

/**
 * Create scroll-margin-inline-start utility classes.
 */
export const useScrollMarginStartUtility = createUseUtility(
	"scroll-margin-inline-start",
	({ value }) => ({
		scrollMarginInlineStart: value,
	}),
);

/**
 * Create scroll-margin-inline-end utility classes.
 */
export const useScrollMarginEndUtility = createUseUtility(
	"scroll-margin-inline-end",
	({ value }) => ({
		scrollMarginInlineEnd: value,
	}),
);

/**
 * Create scroll-padding utility classes.
 */
export const useScrollPaddingUtility = createUseUtility("scroll-padding", ({ value }) => ({
	scrollPadding: value,
}));

/**
 * Create scroll-padding-x utility classes.
 */
export const useScrollPaddingXUtility = createUseUtility("scroll-padding-x", ({ value }) => ({
	scrollPaddingLeft: value,
	scrollPaddingRight: value,
}));

/**
 * Create scroll-padding-y utility classes.
 */
export const useScrollPaddingYUtility = createUseUtility("scroll-padding-y", ({ value }) => ({
	scrollPaddingTop: value,
	scrollPaddingBottom: value,
}));

/**
 * Create scroll-padding-top utility classes.
 */
export const useScrollPaddingTopUtility = createUseUtility("scroll-padding-top", ({ value }) => ({
	scrollPaddingTop: value,
}));

/**
 * Create scroll-padding-right utility classes.
 */
export const useScrollPaddingRightUtility = createUseUtility(
	"scroll-padding-right",
	({ value }) => ({
		scrollPaddingRight: value,
	}),
);

/**
 * Create scroll-padding-bottom utility classes.
 */
export const useScrollPaddingBottomUtility = createUseUtility(
	"scroll-padding-bottom",
	({ value }) => ({
		scrollPaddingBottom: value,
	}),
);

/**
 * Create scroll-padding-left utility classes.
 */
export const useScrollPaddingLeftUtility = createUseUtility("scroll-padding-left", ({ value }) => ({
	scrollPaddingLeft: value,
}));

/**
 * Create scroll-padding-inline-start utility classes.
 */
export const useScrollPaddingStartUtility = createUseUtility(
	"scroll-padding-inline-start",
	({ value }) => ({
		scrollPaddingInlineStart: value,
	}),
);

/**
 * Create scroll-padding-inline-end utility classes.
 */
export const useScrollPaddingEndUtility = createUseUtility(
	"scroll-padding-inline-end",
	({ value }) => ({
		scrollPaddingInlineEnd: value,
	}),
);
