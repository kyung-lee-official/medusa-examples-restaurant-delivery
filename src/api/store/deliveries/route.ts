import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import zod from "zod";
import { DELIVERY_MODULE } from "../../../modules/delivery";
import { createDeliveryWorkflow } from "../../../workflows/delivery/create-delivery";
import { handleDeliveryWorkflow } from "../../../workflows/delivery/handle-delivery";

const schema = zod.object({
	cart_id: zod.string(),
	restaurant_id: zod.string(),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const validatedBody = schema.parse(req.body);

	const { result: delivery } = await createDeliveryWorkflow(req.scope).run({
		input: {
			cart_id: validatedBody.cart_id,
			restaurant_id: validatedBody.restaurant_id,
		},
	});

	await handleDeliveryWorkflow(req.scope).run({
		input: {
			delivery_id: delivery.id,
		},
	});

	return res.status(200).json({ delivery });
}
