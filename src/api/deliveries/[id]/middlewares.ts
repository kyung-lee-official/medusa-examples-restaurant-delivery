import { authenticate, defineMiddlewares } from "@medusajs/framework/http";
import { isDeliveryRestaurant } from "../../utils/is-delivery-restaurant";

export const deliveriesMiddlewares = defineMiddlewares({
	routes: [
		{
			matcher: "/deliveries/:id/accept",
			middlewares: [
				authenticate("restaurant", "bearer"),
				isDeliveryRestaurant,
			],
		},
	],
});
