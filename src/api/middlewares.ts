import { authenticate, defineMiddlewares } from "@medusajs/framework/http";

export default defineMiddlewares({
	routes: [
		{
			method: ["POST"],
			matcher: "/users",
			middlewares: [
				authenticate(["driver", "restaurant"], "bearer", {
					allowUnregistered: true,
				}),
			],
		},
	],
});
