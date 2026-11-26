import vue from "@vitejs/plugin-vue";
import styleframe from "styleframe/plugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		vue(),
		styleframe({
			scanner: {
				content: ["./src/**/*.{vue,ts,tsx}", "./index.html"],
			},
			recipes: {
				include: ["tooltip"],
			},
		}),
	],
});
