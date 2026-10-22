import type { Formation } from "@uxfront/scene";
import { empty } from "./empty";

/** For the fluid typography section. Draws nothing yet. */
export const device = (options: { label: string; key?: string }): Formation =>
	empty({ key: options.key ?? "device", label: options.label });
