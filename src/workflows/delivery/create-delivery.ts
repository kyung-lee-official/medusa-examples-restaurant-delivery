import {
	WorkflowData,
	WorkflowResponse,
	createWorkflow,
	transform,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { validateRestaurantStep } from "./steps/validate-restaurant";
import { createDeliveryStep } from "./steps/create-delivery";
import { DELIVERY_MODULE } from "../../modules/delivery";
import { RESTAURANT_MODULE } from "../../modules/restaurant";

type WorkflowInput = {
	cart_id: string;
	restaurant_id: string;
};

export const createDeliveryWorkflowId = "create-delivery-workflow";
export const createDeliveryWorkflow = createWorkflow(
	createDeliveryWorkflowId,
	function (input: WorkflowInput) {
		validateRestaurantStep({
			restaurant_id: input.restaurant_id,
		});
		const delivery = createDeliveryStep();

		const links = transform(
			{
				input,
				delivery,
			},
			(data) => [
				{
					[DELIVERY_MODULE]: {
						delivery_id: data.delivery.id,
					},
					[Modules.CART]: {
						cart_id: data.input.cart_id,
					},
				},
				{
					[RESTAURANT_MODULE]: {
						restaurant_id: data.input.restaurant_id,
					},
					[DELIVERY_MODULE]: {
						delivery_id: data.delivery.id,
					},
				},
			]
		);

		createRemoteLinkStep(links as any);

		return new WorkflowResponse(delivery);
	}
);
