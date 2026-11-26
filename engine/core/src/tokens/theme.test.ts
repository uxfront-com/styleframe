import type {
	DeclarationsCallback,
	DeclarationsCallbackContext,
	Root,
	Selector,
	Theme,
} from "../types";
import { createRoot } from "./root";
import { createThemeFunction } from "./theme";

describe("createThemeFunction", () => {
	let parent: Root;
	let root: Root;
	let theme: ReturnType<typeof createThemeFunction>;

	beforeEach(() => {
		root = createRoot();
		parent = root;

		theme = createThemeFunction(parent, root);
	});

	describe("when creating a new theme", () => {
		it("should create a new theme with the given name", () => {
			const callback: DeclarationsCallback = () => {};

			const result = theme("dark", callback);

			expect(result).toEqual({
				type: "theme",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "dark",
				declarations: {},
				variables: [],
				children: [],
			});
		});

		it("should add the new theme to root.themes array", () => {
			const callback: DeclarationsCallback = () => {};

			const result = theme("dark", callback);

			expect(root.themes).toHaveLength(1);
			expect(root.themes[0]).toBe(result);
			expect(root.themes[0]).toEqual({
				type: "theme",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "dark",
				declarations: {},
				variables: [],
				children: [],
			});
		});

		it("should call the callback with declarations context", () => {
			let callbackWasCalled = false;
			let receivedContext: DeclarationsCallbackContext | null = null;

			const callback: DeclarationsCallback = (context) => {
				callbackWasCalled = true;
				receivedContext = context;
			};

			theme("dark", callback);

			expect(callbackWasCalled).toBe(true);
			expect(receivedContext).toBeDefined();
			if (!receivedContext) {
				throw new Error("Callback context should not be null");
			}

			expect(receivedContext).toHaveProperty("variable");
			expect(receivedContext).toHaveProperty("selector");
			expect(receivedContext).toHaveProperty("keyframes");
			expect(receivedContext).toHaveProperty("media");

			expect((receivedContext as DeclarationsCallbackContext).variable).toBeTypeOf("function");
			expect((receivedContext as DeclarationsCallbackContext).selector).toBeTypeOf("function");
			expect((receivedContext as DeclarationsCallbackContext).keyframes).toBeTypeOf("function");
			expect((receivedContext as DeclarationsCallbackContext).media).toBeTypeOf("function");
		});

		it("should allow callback to add children to the theme", () => {
			const callback: DeclarationsCallback = (context) => {
				context.variable("primary-color", "#000000");
				context.selector("body", { color: "#ffffff" });
			};

			const result = theme("dark", callback);

			expect(result.children.length).toBeGreaterThan(0);
		});
	});

	describe("when theme already exists", () => {
		it("should return the existing theme instead of creating a new one", () => {
			const existingTheme: Theme = {
				type: "theme",
				id: "test-id",
				name: "dark",
				declarations: {},
				variables: [],
				children: [],
			};
			root.themes.push(existingTheme);

			const callback: DeclarationsCallback = () => {};

			const result = theme("dark", callback);

			expect(result).toBe(existingTheme);
			expect(root.themes).toHaveLength(1);
		});

		it("should not add duplicate theme to root.themes array", () => {
			const existingTheme: Theme = {
				type: "theme",
				id: "test-id",
				name: "dark",
				declarations: {},
				variables: [],
				children: [],
			};
			root.themes.push(existingTheme);

			const callback: DeclarationsCallback = () => {};

			theme("dark", callback);

			expect(root.themes).toHaveLength(1);
			expect(root.themes[0]).toBe(existingTheme);
		});

		it("should still call the callback with existing theme", () => {
			const existingTheme: Theme = {
				type: "theme",
				id: "test-id",
				name: "dark",
				declarations: {},
				variables: [],
				children: [],
			};
			root.themes.push(existingTheme);

			let callbackWasCalled = false;
			const callback: DeclarationsCallback = (context) => {
				callbackWasCalled = true;
				context.variable("test-var", "test-value");
			};

			const result = theme("dark", callback);

			expect(callbackWasCalled).toBe(true);
			expect(result).toBe(existingTheme);
			expect(result.variables.length).toBeGreaterThan(0);
		});
	});

	describe("when callback is not provided", () => {
		it("should create theme without calling any callback", () => {
			const result = theme("light", undefined as any);

			expect(result).toEqual({
				type: "theme",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "light",
				declarations: {},
				variables: [],
				children: [],
			});
			expect(root.themes).toHaveLength(1);
			expect(result.children).toHaveLength(0);
		});

		it("should handle null callback gracefully", () => {
			const result = theme("light", null as any);

			expect(result).toEqual({
				type: "theme",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "light",
				declarations: {},
				variables: [],
				children: [],
			});
			expect(root.themes).toHaveLength(1);
		});
	});

	describe("multiple theme creation", () => {
		it("should handle creating multiple different themes", () => {
			const callback1: DeclarationsCallback = (context) => {
				context.variable("dark-bg", "#000000");
			};

			const callback2: DeclarationsCallback = (context) => {
				context.variable("light-bg", "#ffffff");
			};

			const darkTheme = theme("dark", callback1);
			const lightTheme = theme("light", callback2);

			expect(root.themes).toHaveLength(2);
			expect(darkTheme.name).toBe("dark");
			expect(lightTheme.name).toBe("light");
			expect(darkTheme.variables.length).toBeGreaterThan(0);
			expect(lightTheme.variables.length).toBeGreaterThan(0);
		});

		it("should handle mixed new and existing themes", () => {
			const existingTheme: Theme = {
				type: "theme",
				id: "test-id",
				name: "existing",
				declarations: {},
				variables: [],
				children: [],
			};
			root.themes.push(existingTheme);

			const callback: DeclarationsCallback = (context) => {
				context.variable("test-var", "test-value");
			};

			const retrievedTheme = theme("existing", callback);
			const newTheme = theme("new", callback);

			expect(root.themes).toHaveLength(2);
			expect(retrievedTheme).toBe(existingTheme);
			expect(newTheme.name).toBe("new");
			expect(retrievedTheme.variables.length).toBeGreaterThan(0);
			expect(newTheme.variables.length).toBeGreaterThan(0);
		});
	});

	describe("callback functionality", () => {
		it("should provide working variable function in callback context", () => {
			const callback: DeclarationsCallback = (context) => {
				const variable = context.variable("test-color", "#ff0000");
				expect(variable).toBeDefined();
				expect(variable.name).toBe("test-color");
				expect(variable.value).toBe("#ff0000");
			};

			const result = theme("test", callback);
			expect(result.variables.length).toBe(1);
		});

		it("should provide working selector function in callback context", () => {
			let selectorResult: Selector | undefined;

			const callback: DeclarationsCallback = (context) => {
				selectorResult = context.selector(".test", { color: "red" });
			};

			const result = theme("test", callback);

			expect(selectorResult).toBeDefined();
			expect(result.children.length).toBe(1);
		});

		it("should allow complex theme definitions with multiple elements", () => {
			const callback: DeclarationsCallback = (context) => {
				context.variable("primary", "#007bff");
				context.variable("secondary", "#6c757d");
				context.selector(".btn-primary", {
					backgroundColor: "var(--primary)",
					color: "#fff",
				});
				context.selector(".btn-secondary", {
					backgroundColor: "var(--secondary)",
					color: "#fff",
				});
			};

			const result = theme("bootstrap-theme", callback);

			expect(result.children).toHaveLength(2);
			expect(result.variables).toHaveLength(2);
			expect(root.themes).toHaveLength(1);
		});
	});

	describe("edge cases", () => {
		it("should handle empty theme name", () => {
			const callback: DeclarationsCallback = () => {};

			const result = theme("", callback);

			expect(result.name).toBe("");
			expect(result.type).toBe("theme");
			expect(root.themes).toHaveLength(1);
		});

		it("should handle theme names with special characters", () => {
			const callback: DeclarationsCallback = () => {};
			const specialName = "theme-with_special.chars@123";

			const result = theme(specialName, callback);

			expect(result.name).toBe(specialName);
			expect(root.themes[0]?.name).toBe(specialName);
		});

		it("should preserve existing children when theme already exists", () => {
			const existingTheme: Theme = {
				type: "theme",
				id: "test-id",
				name: "existing",
				declarations: {},
				variables: [
					{
						type: "variable",
						id: "test-id",
						name: "existing-var",
						value: "existing-value",
					},
				],
				children: [],
			};
			root.themes.push(existingTheme);

			const callback: DeclarationsCallback = (context) => {
				context.variable("new-var", "new-value");
			};

			const result = theme("existing", callback);

			expect(result.variables).toHaveLength(2);
			expect(result.variables[0]).toEqual({
				type: "variable",
				id: "test-id",
				name: "existing-var",
				value: "existing-value",
			});
		});
	});
});
