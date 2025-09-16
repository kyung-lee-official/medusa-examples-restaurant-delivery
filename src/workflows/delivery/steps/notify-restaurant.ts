import {
	Modules,
	ContainerRegistrationKeys,
	MedusaError,
} from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";

export const notifyRestaurantStepId = "notify-restaurant-step";
export const notifyRestaurantStep = createStep(
	{
		name: notifyRestaurantStepId,
		async: true,
		timeout: 60 * 15,
		maxRetries: 2,
	},
	async function (deliveryId: string, { container }) {
		const query = container.resolve(ContainerRegistrationKeys.QUERY);

		const {
			data: [delivery],
		} = await query.graph({
			entity: "deliveries",
			filters: {
				id: deliveryId,
			},
			fields: ["id", "restaurant.id"],
		});

		const eventBus = container.resolve(Modules.EVENT_BUS);

		if (!delivery.restaurant) {
			throw new MedusaError(
				MedusaError.Types.NOT_FOUND,
				`Delivery with id ${deliveryId} has no associated restaurant`
			);
		}

		await eventBus.emit({
			name: "notify.restaurant",
			data: {
				restaurant_id: delivery.restaurant.id,
				delivery_id: delivery.id,
			},
		});
	}
);
