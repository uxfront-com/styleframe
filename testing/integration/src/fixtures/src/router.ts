import { createRouter, createWebHashHistory } from "vue-router";

import BordersEffectsPage from "./pages/BordersEffectsPage.vue";
import HomePage from "./pages/HomePage.vue";
import KeyframesPage from "./pages/KeyframesPage.vue";
import LayoutFlexboxPage from "./pages/LayoutFlexboxPage.vue";
import RecipesPage from "./pages/RecipesPage.vue";
import SelectorsAdvancedPage from "./pages/SelectorsAdvancedPage.vue";
import SelectorsPage from "./pages/SelectorsPage.vue";
import ThemesPage from "./pages/ThemesPage.vue";
import TreeShakingPage from "./pages/TreeShakingPage.vue";
import UtilitiesAutogeneratePage from "./pages/UtilitiesAutogeneratePage.vue";
import UtilitiesPage from "./pages/UtilitiesPage.vue";
import VariablesPage from "./pages/VariablesPage.vue";

export const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/", component: HomePage },
		{ path: "/selectors", component: SelectorsPage },
		{ path: "/utilities", component: UtilitiesPage },
		{ path: "/variables", component: VariablesPage },
		{ path: "/selectors-advanced", component: SelectorsAdvancedPage },
		{ path: "/themes", component: ThemesPage },
		{ path: "/recipes", component: RecipesPage },
		{ path: "/utilities-autogenerate", component: UtilitiesAutogeneratePage },
		{ path: "/layout-flexbox", component: LayoutFlexboxPage },
		{ path: "/borders-effects", component: BordersEffectsPage },
		{ path: "/keyframes", component: KeyframesPage },
		{ path: "/tree-shaking", component: TreeShakingPage },
	],
});
