import {
	CreateOrderDTO,
	CreateOrderShippingMethodDTO,
} from "@medusajs/framework/types";
import {
	Modules,
	ContainerRegistrationKeys,
	MedusaError,
} from "@medusajs/framework/utils";
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";
import { DELIVERY_MODULE } from "../../../modules/delivery";
import { Address } from "../../../../.medusa/types/query-entry-points";

export const createOrderStep = createStep(
	"create-order-step",
	async function (deliveryId: string, { container }) {
		const query = container.resolve(ContainerRegistrationKeys.QUERY);

		const {
			data: [delivery],
		} = await query.graph({
			entity: "deliveries",
			fields: [
				"id",
				"cart.* ",
				"cart.shipping_address.*",
				"cart.billing_address.*",
				"cart.items.*",
				"cart.shipping_methods.*",
			],
			filters: {
				id: deliveryId,
			},
		});

		const { cart } = delivery;

		const orderModuleService = container.resolve(Modules.ORDER);

		if (!cart) {
			throw new MedusaError(
				MedusaError.Types.NOT_FOUND,
				`Delivery with id ${deliveryId} has no associated cart`
			);
		}

		const order = await orderModuleService.createOrders({
			currency_code: cart.currency_code,
			email: cart.email as string,
			shipping_address: cart.shipping_address as Address,
			billing_address: cart.billing_address as Address,
			items: cart.items,
			region_id: cart.region_id as string,
			customer_id: cart.customer_id as string,
			sales_channel_id: cart.sales_channel_id as string,
			shipping_methods:
				cart.shipping_methods as unknown as CreateOrderShippingMethodDTO[],
		} as CreateOrderDTO);

		const linkDef = [
			{
				[DELIVERY_MODULE]: {
					delivery_id: delivery.id as string,
				},
				[Modules.ORDER]: {
					order_id: order.id,
				},
			},
		];

		return new StepResponse(
			{
				order,
				linkDef,
			},
			{
				orderId: order.id,
			}
		);
	},
	async ({ orderId }: { orderId: string }, { container }) => {
		const orderService = container.resolve(Modules.ORDER);
		await orderService.softDeleteOrders([orderId]);
	}
);
