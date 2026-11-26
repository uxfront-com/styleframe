import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const monoStack =
	'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

export const playgroundEditorThemeLight = EditorView.theme(
	{
		"&": {
			height: "100%",
			backgroundColor: "transparent",
			color: "inherit",
			fontFamily: monoStack,
		},
		".cm-scroller": {
			fontFamily: monoStack,
			lineHeight: "1.5",
		},
		".cm-gutters": {
			backgroundColor: "transparent",
			color: "rgb(148, 163, 184)",
			border: "none",
		},
		".cm-activeLine": {
			backgroundColor: "rgba(148, 163, 184, 0.08)",
		},
		".cm-activeLineGutter": {
			backgroundColor: "transparent",
		},
		".cm-content": {
			padding: "12px 0",
			caretColor: "currentColor",
		},
		".cm-cursor": {
			borderLeftColor: "currentColor",
		},
		".cm-selectionBackground, ::selection": {
			backgroundColor: "rgba(0, 122, 153, 0.25)",
		},
		"&.cm-focused .cm-selectionBackground": {
			backgroundColor: "rgba(0, 122, 153, 0.25)",
		},
		".cm-line": {
			padding: "0 12px",
		},
	},
	{ dark: false },
);

export const playgroundEditorThemeDark = EditorView.theme(
	{
		"&": {
			height: "100%",
			backgroundColor: "transparent",
			color: "inherit",
			fontFamily: monoStack,
		},
		".cm-scroller": {
			fontFamily: monoStack,
			lineHeight: "1.5",
		},
		".cm-gutters": {
			backgroundColor: "transparent",
			color: "rgb(100, 116, 139)",
			border: "none",
		},
		".cm-activeLine": {
			backgroundColor: "rgba(148, 163, 184, 0.12)",
		},
		".cm-activeLineGutter": {
			backgroundColor: "transparent",
		},
		".cm-content": {
			padding: "12px 0",
			caretColor: "currentColor",
		},
		".cm-cursor": {
			borderLeftColor: "currentColor",
		},
		".cm-selectionBackground, ::selection": {
			backgroundColor: "rgba(56, 189, 248, 0.30)",
		},
		"&.cm-focused .cm-selectionBackground": {
			backgroundColor: "rgba(56, 189, 248, 0.30)",
		},
		".cm-line": {
			padding: "0 12px",
		},
	},
	{ dark: true },
);

export const playgroundHighlightStyleLight = HighlightStyle.define([
	{ tag: t.keyword, color: "#7c3aed" },
	{ tag: [t.string, t.special(t.string)], color: "#047857" },
	{ tag: [t.number, t.bool, t.null], color: "#b45309" },
	{
		tag: [t.comment, t.lineComment, t.blockComment],
		color: "#64748b",
		fontStyle: "italic",
	},
	{
		tag: [t.function(t.variableName), t.function(t.propertyName)],
		color: "#2563eb",
	},
	{ tag: [t.typeName, t.className, t.namespace], color: "#b45309" },
	{ tag: t.propertyName, color: "#0f172a" },
	{ tag: [t.operator, t.punctuation], color: "#475569" },
	{ tag: t.tagName, color: "#be123c" },
	{ tag: t.attributeName, color: "#b45309" },
	{ tag: t.labelName, color: "#be123c" },
	{ tag: t.constant(t.className), color: "#7c3aed" },
	{ tag: t.definitionKeyword, color: "#7c3aed" },
	{ tag: t.definitionOperator, color: "#be123c" },
	{ tag: [t.color, t.unit], color: "#b45309" },
	{ tag: [t.atom, t.operatorKeyword], color: "#2563eb" },
	{ tag: t.modifier, color: "#7c3aed" },
	{
		tag: [t.logicOperator, t.compareOperator, t.arithmeticOperator],
		color: "#475569",
	},
]);

export const playgroundHighlightStyleDark = HighlightStyle.define([
	{ tag: t.keyword, color: "#c678dd" },
	{ tag: [t.string, t.special(t.string)], color: "#98c379" },
	{ tag: [t.number, t.bool, t.null], color: "#d19a66" },
	{
		tag: [t.comment, t.lineComment, t.blockComment],
		color: "#7f848e",
		fontStyle: "italic",
	},
	{
		tag: [t.function(t.variableName), t.function(t.propertyName)],
		color: "#61afef",
	},
	{ tag: [t.typeName, t.className, t.namespace], color: "#e5c07b" },
	{ tag: t.propertyName, color: "#e06c75" },
	{ tag: [t.operator, t.punctuation], color: "#abb2bf" },
	{ tag: t.tagName, color: "#e06c75" },
	{ tag: t.attributeName, color: "#d19a66" },
	{ tag: t.labelName, color: "#e06c75" },
	{ tag: t.constant(t.className), color: "#c678dd" },
	{ tag: t.definitionKeyword, color: "#c678dd" },
	{ tag: t.definitionOperator, color: "#e06c75" },
	{ tag: [t.color, t.unit], color: "#d19a66" },
	{ tag: [t.atom, t.operatorKeyword], color: "#61afef" },
	{ tag: t.modifier, color: "#c678dd" },
	{
		tag: [t.logicOperator, t.compareOperator, t.arithmeticOperator],
		color: "#abb2bf",
	},
]);

export type PlaygroundEditorTheme = "light" | "dark";

export function playgroundTheme(resolved: PlaygroundEditorTheme): Array<Extension> {
	return resolved === "dark"
		? [playgroundEditorThemeDark, syntaxHighlighting(playgroundHighlightStyleDark)]
		: [playgroundEditorThemeLight, syntaxHighlighting(playgroundHighlightStyleLight)];
}
