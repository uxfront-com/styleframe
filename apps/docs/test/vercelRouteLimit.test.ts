import { describe, expect, it } from "vitest";
import {
	splitLongRoutes,
	VERCEL_ROUTE_SRC_LIMIT,
} from "../modules/vercelRouteLimit";

describe("splitLongRoutes", () => {
	const paths = Array.from(
		{ length: 200 },
		(_, index) => `/docs/theme/components/component-${index}`,
	);
	const vary = {
		src: `^(${paths.join("|")})$`,
		headers: { vary: "Accept, User-Agent" },
		continue: true,
	};

	it("splits a long alternation into routes under the limit", () => {
		expect(vary.src.length).toBeGreaterThan(VERCEL_ROUTE_SRC_LIMIT);

		const routes = splitLongRoutes([vary]);

		expect(routes.length).toBeGreaterThan(1);
		for (const route of routes) {
			expect(route.src.length).toBeLessThanOrEqual(VERCEL_ROUTE_SRC_LIMIT);
			expect(route.headers).toEqual(vary.headers);
			expect(route.continue).toBe(true);
		}
	});

	it("keeps every path, in order", () => {
		const routes = splitLongRoutes([vary]);
		const split = routes.flatMap((route) =>
			route.src.replace(/^\^\(|\)\$$/g, "").split("|"),
		);

		expect(split).toEqual(paths);
	});

	it("leaves short routes and their order alone", () => {
		const before = { src: "^/$", dest: "/llms.txt" };
		const after = { handle: "filesystem" };

		const routes = splitLongRoutes([before, vary, after]);

		expect(routes[0]).toBe(before);
		expect(routes.at(-1)).toBe(after);
	});

	it("fails on a long src it can't split", () => {
		const src = `^/${"a".repeat(VERCEL_ROUTE_SRC_LIMIT)}$`;

		expect(() => splitLongRoutes([{ src }])).toThrow(/4096/);
	});
});
