import type { Formation } from "@uxfront/scene";
import { empty } from "./empty";

/**
 * For a chapter with a code sample beside its copy. Draws nothing yet. Each
 * chapter needs its own `key`, like a repeated `empty`.
 */
export const codeBlock = (options: { label: string; key: string }): Formation =>
	empty(options);
