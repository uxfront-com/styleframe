import type { Styleframe } from "@styleframe/core";

/**
 * Applies sanitize.css base normalization rules.
 *
 * Implements https://github.com/csstools/sanitize.css/blob/main/sanitize.css
 * Provides cross-browser consistency for default element styles.
 *
 * @param s - The Styleframe instance to register selectors with
 */
export function useSanitizeBaseSelectors(s: Styleframe): void {
	const { selector } = s;

	/* Document
	 * ====================================================================== */

	/**
	 * 1. Add border box sizing in all browsers (opinionated).
	 * 2. Backgrounds do not repeat by default (opinionated).
	 */
	selector("*, ::before, ::after", {
		boxSizing: "border-box",
		backgroundRepeat: "no-repeat",
	});

	/**
	 * 1. Add text decoration inheritance in all browsers (opinionated).
	 * 2. Add vertical alignment inheritance in all browsers (opinionated).
	 */
	selector("::before, ::after", {
		textDecoration: "inherit",
		verticalAlign: "inherit",
	});

	/**
	 * 1. Use the default cursor in all browsers (opinionated).
	 * 2. Change the line height in all browsers (opinionated).
	 * 3. Breaks words to prevent overflow in all browsers (opinionated).
	 * 4. Use a 4-space tab width in all browsers (opinionated).
	 * 5. Remove the grey highlight on links in iOS (opinionated).
	 * 6. Prevent adjustments of font size after orientation changes in iOS.
	 */
	selector(":where(:root)", {
		cursor: "default",
		lineHeight: 1.5,
		overflowWrap: "break-word",
		MozTabSize: 4,
		tabSize: 4,
		WebkitTapHighlightColor: "transparent",
		WebkitTextSizeAdjust: "100%",
		textSizeAdjust: "100%",
	});

	/* Sections
	 * ====================================================================== */

	/**
	 * Remove the margin in all browsers (opinionated).
	 */
	selector(":where(body)", {
		margin: 0,
	});

	/**
	 * Correct the font size and margin on `h1` elements within `section` and
	 * `article` contexts in Chrome, Edge, Firefox, and Safari.
	 */
	selector(":where(h1)", {
		fontSize: "2em",
		margin: "0.67em 0",
	});

	/* Grouping content
	 * ====================================================================== */

	/**
	 * Remove the margin on nested lists in Chrome, Edge, and Safari.
	 */
	selector(":where(dl, ol, ul) :where(dl, ol, ul)", {
		margin: 0,
	});

	/**
	 * 1. Correct the inheritance of border color in Firefox.
	 * 2. Add the correct box sizing in Firefox.
	 */
	selector(":where(hr)", {
		color: "inherit",
		height: 0,
	});

	/**
	 * Remove the list style on navigation lists in all browsers (opinionated).
	 */
	selector(":where(nav) :where(ol, ul)", {
		listStyleType: "none",
		padding: 0,
	});

	/**
	 * Prevent VoiceOver from ignoring list semantics in Safari (opinionated).
	 */
	selector(":where(nav li)::before", {
		content: String.raw`"\200B"`,
		float: "left",
	});

	/**
	 * 1. Correct the inheritance and scaling of font size in all browsers.
	 * 2. Correct the odd `em` font sizing in all browsers.
	 * 3. Prevent overflow of the container in all browsers (opinionated).
	 */
	selector(":where(pre)", {
		fontFamily: "monospace, monospace",
		fontSize: "1em",
		overflow: "auto",
	});

	/* Text-level semantics
	 * ====================================================================== */

	/**
	 * Add the correct text decoration in Safari.
	 */
	selector(":where(abbr[title])", {
		textDecoration: "underline",
	});

	selector(":where(abbr[title])", {
		textDecoration: "underline dotted",
	});

	/**
	 * Add the correct font weight in Chrome, Edge, and Safari.
	 */
	selector(":where(b, strong)", {
		fontWeight: "bolder",
	});

	/**
	 * 1. Correct the inheritance and scaling of font size in all browsers.
	 * 2. Correct the odd `em` font sizing in all browsers.
	 */
	selector(":where(code, kbd, samp)", {
		fontFamily: "monospace, monospace",
		fontSize: "1em",
	});

	/**
	 * Add the correct font size in all browsers.
	 */
	selector(":where(small)", {
		fontSize: "80%",
	});

	/* Embedded content
	 * ====================================================================== */

	/**
	 * Change the alignment on media elements in all browsers (opinionated).
	 */
	selector(":where(audio, canvas, iframe, img, svg, video)", {
		verticalAlign: "middle",
	});

	/**
	 * Remove the border on iframes in all browsers (opinionated).
	 */
	selector(":where(iframe)", {
		borderStyle: "none",
	});

	/**
	 * Change the fill color to match the text color in all browsers (opinionated).
	 */
	selector(":where(svg:not([fill]))", {
		fill: "currentColor",
	});

	/* Tabular data
	 * ====================================================================== */

	/**
	 * 1. Collapse border spacing in all browsers (opinionated).
	 * 2. Correct table border color in Chrome, Edge, and Safari.
	 * 3. Remove text indentation from table contents in Chrome, Edge, and Safari.
	 */
	selector(":where(table)", {
		borderCollapse: "collapse",
		borderColor: "currentColor",
		textIndent: 0,
	});

	/* Forms
	 * ====================================================================== */

	/**
	 * Remove the margin on controls in Safari.
	 */
	selector(":where(button, input, select)", {
		margin: 0,
	});

	/**
	 * Correct the inability to style buttons in iOS and Safari.
	 */
	selector(
		':where(button, [type="button" i], [type="reset" i], [type="submit" i])',
		{
			WebkitAppearance: "button",
		},
	);

	/**
	 * Change the inconsistent appearance in all browsers (opinionated).
	 */
	selector(":where(fieldset)", {
		border: "1px solid #a0a0a0",
	});

	/**
	 * Add the correct vertical alignment in Chrome, Edge, and Firefox.
	 */
	selector(":where(progress)", {
		verticalAlign: "baseline",
	});

	/**
	 * 1. Remove the margin in Firefox and Safari.
	 * 2. Change the resize direction in all browsers (opinionated).
	 */
	selector(":where(textarea)", {
		margin: 0,
		resize: "vertical",
	});

	/**
	 * 1. Correct the odd appearance in Chrome, Edge, and Safari.
	 * 2. Correct the outline style in Safari.
	 */
	selector(':where([type="search" i])', {
		WebkitAppearance: "textfield",
		outlineOffset: "-2px",
	});

	/**
	 * Correct the cursor style of increment and decrement buttons in Safari.
	 */
	selector("::-webkit-inner-spin-button, ::-webkit-outer-spin-button", {
		height: "auto",
	});

	/**
	 * Correct the text style of placeholders in Chrome, Edge, and Safari.
	 */
	selector("::-webkit-input-placeholder", {
		color: "inherit",
		opacity: 0.54,
	});

	/**
	 * Remove the inner padding in Chrome, Edge, and Safari on macOS.
	 */
	selector("::-webkit-search-decoration", {
		WebkitAppearance: "none",
	});

	/**
	 * 1. Correct the inability to style upload buttons in iOS and Safari.
	 * 2. Change font properties to `inherit` in Safari.
	 */
	selector("::-webkit-file-upload-button", {
		WebkitAppearance: "button",
		font: "inherit",
	});

	/* Interactive
	 * ====================================================================== */

	/**
	 * Add the correct styles in Safari.
	 */
	selector(":where(dialog)", {
		backgroundColor: "white",
		border: "solid",
		color: "black",
		height: "-moz-fit-content",
		left: 0,
		margin: "auto",
		padding: "1em",
		position: "absolute",
		right: 0,
		width: "-moz-fit-content",
	});

	selector(":where(dialog)", {
		height: "fit-content",
		width: "fit-content",
	});

	selector(":where(dialog:not([open]))", {
		display: "none",
	});

	/**
	 * Add the correct display in Safari.
	 */
	selector(":where(details > summary:first-of-type)", {
		display: "list-item",
	});

	/* Accessibility
	 * ====================================================================== */

	/**
	 * Change the cursor on busy elements in all browsers (opinionated).
	 */
	selector(':where([aria-busy="true" i])', {
		cursor: "progress",
	});

	/**
	 * Change the cursor on disabled, not-editable, or otherwise
	 * inoperable elements in all browsers (opinionated).
	 */
	selector(':where([aria-disabled="true" i], [disabled])', {
		cursor: "not-allowed",
	});

	/**
	 * Change the display on visually hidden accessible elements
	 * in all browsers (opinionated).
	 */
	selector(':where([aria-hidden="false" i][hidden])', {
		display: "initial",
	});

	selector(':where([aria-hidden="false" i][hidden]:not(:focus))', {
		clip: "rect(0, 0, 0, 0)",
		position: "absolute",
	});
}
