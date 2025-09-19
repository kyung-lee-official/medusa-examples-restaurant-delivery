import {
	AuthenticatedMedusaRequest,
	MedusaRequest,
	MedusaResponse,
} from "@medusajs/framework/http";
import { claimDeliveryWorkflow } from "../../../../workflows/delivery/claim-delivery";

export async function POST(
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse
) {
	const deliveryId = req.params.id;

	const claimedDelivery = await claimDeliveryWorkflow(req.scope).run({
		input: {
			driver_id: req.auth_context.actor_id,
			delivery_id: deliveryId,
		},
	});

	return res.status(200).json({ delivery: claimedDelivery });
}
