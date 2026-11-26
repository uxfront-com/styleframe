import { createUseUtility } from "../../utils";
import { containerTypeValues } from "../../values";

/**
 * Create container-type utility classes.
 *
 * Establishes a query container so descendants can respond to its size via
 * the container-query modifiers.
 */
export const useContainerTypeUtility = createUseUtility(
	"container-type",
	({ value }) => ({
		containerType: value,
	}),
	{ defaults: containerTypeValues },
);

/**
 * Create container-name utility classes.
 *
 * Names a query container so `@container <name> (…)` queries can target it.
 * Names are project-defined, so this utility ships without defaults.
 */
export const useContainerNameUtility = createUseUtility("container-name", ({ value }) => ({
	containerName: value,
}));
