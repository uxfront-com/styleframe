import type {
	AtRule,
	Container,
	CSS,
	Root,
	TokenValue,
	Variable,
} from "../types";
import { isAtRule, isRef, isVariable } from "../typeGuards";
import { createRefFunction } from "./ref";
import { parseAtReferences } from "./resolve";

export function createCssFunction(_parent: Container, root: Root) {
	const ref = createRefFunction(_parent, root);

	const parseAndTrack = (str: string): Array<TokenValue> => {
		const parts = parseAtReferences(str);
		for (const part of parts) {
			if (isRef(part)) {
				root._usage.variables.add(part.name);
			}
		}
		return parts;
	};

	return function css(
		strings: TemplateStringsArray,
		...interpolations: Array<TokenValue | Variable | AtRule>
	): CSS {
		const value = strings.reduce<Array<TokenValue>>((acc, str, i) => {
			acc.push(...parseAndTrack(str));

			if (i < interpolations.length) {
				const interpolation = interpolations[i];

				if (isVariable(interpolation)) {
					acc.push(ref(interpolation));
				} else if (isAtRule(interpolation)) {
					acc.push(interpolation.rule);
				} else if (
					typeof interpolation === "string" &&
					interpolation.includes("@")
				) {
					acc.push(...parseAndTrack(interpolation));
				} else {
					acc.push(interpolation);
				}
			}

			return acc;
		}, []);

		return {
			type: "css",
			value,
		};
	};
}
