import { genDeclarationsBlock } from "./genDeclarationsBlock";

export function genSelector(query: string, declarations: Array<string>): string {
	return `${query} ${genDeclarationsBlock(declarations)}`;
}
