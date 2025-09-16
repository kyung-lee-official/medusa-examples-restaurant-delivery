import {
	createWorkflow,
	WorkflowResponse,
	when,
} from "@medusajs/framework/workflows-sdk";
import { updateDeliveryStep } from "./steps/update-delivery";
import { UpdateDelivery } from "../../modules/delivery/types";
import { setStepSuccessStep } from "./steps/set-step-success";
import { setStepFailedStep } from "./steps/set-step-failed";

export type WorkflowInput = {
	data: UpdateDelivery;
	stepIdToSucceed?: string;
	stepIdToFail?: string;
};

export const updateDeliveryWorkflow = createWorkflow(
	"update-delivery-workflow",
	function (input: WorkflowInput) {
		/* update the delivery with the provided data */
		const updatedDelivery = updateDeliveryStep({
			data: input.data,
		});

		/* if a stepIdToSucceed is provided, we will set that step as successful */
		when(
			input,
			({ stepIdToSucceed }) => stepIdToSucceed !== undefined
		).then(() => {
			setStepSuccessStep({
				stepId: input.stepIdToSucceed as string,
				updatedDelivery,
			});
		});

		/* if a stepIdToFail is provided, we will set that step as failed */
		when(input, ({ stepIdToFail }) => stepIdToFail !== undefined).then(
			() => {
				setStepFailedStep({
					stepId: input.stepIdToFail as string,
					updatedDelivery,
				});
			}
		);

		/* return the updated delivery */
		return new WorkflowResponse(updatedDelivery);
	}
);
