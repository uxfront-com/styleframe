/**
 * A category folder under Elements or Components: a sidebar group whose name
 * isn't part of its pages' URLs. `modules/nonRouteCategories.ts` reads them
 * from the folders' `.navigation.yml`, and `app/utils/foldNonRouteCategories.ts`
 * groups the sidebar by them.
 */
export interface NonRouteCategoryMeta {
	title: string;
	icon?: string | false;
	defaultOpen?: boolean;
	order: number;
}

declare module "nuxt/schema" {
	interface AppConfig {
		nonRouteCategories?: Record<string, NonRouteCategoryMeta>;
	}
}
