import {
	createStep,
	createWorkflow,
	WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { updateDeliveryStep } from "./steps/update-delivery";
import { DeliveryStatus } from "../../modules/delivery/types";
import { setStepSuccessStep } from "./steps/set-step-success";
import { awaitDriverClaimStepId } from "./steps/await-driver-claim";

export type ClaimWorkflowInput = {
	driver_id: string;
	delivery_id: string;
};

export const claimDeliveryWorkflow = createWorkflow(
	"claim-delivery-workflow",
	function (input: ClaimWorkflowInput) {
		const claimedDelivery = updateDeliveryStep({
			data: {
				id: input.delivery_id,
				driver_id: input.driver_id,
				delivery_status: DeliveryStatus.PICKUP_CLAIMED,
			},
		});

		/* set the step success for the find driver step */
		setStepSuccessStep({
			stepId: awaitDriverClaimStepId,
			updatedDelivery: claimedDelivery,
		});

		/* return the updated delivery */
		return new WorkflowResponse(claimedDelivery);
	}
);
