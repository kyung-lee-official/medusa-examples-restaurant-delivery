import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { RESTAURANT_MODULE } from "../../../modules/restaurant";
import RestaurantModuleService from "../../../modules/restaurant/service";
import { DeleteRestaurantAdminWorkflow } from "../delete-restaurant-admin";

export const deleteRestaurantAdminStep = createStep(
	"delete-restaurant-admin",
	async ({ id }: DeleteRestaurantAdminWorkflow, { container }) => {
		const restaurantModuleService: RestaurantModuleService =
			container.resolve(RESTAURANT_MODULE);

		const admin = await restaurantModuleService.retrieveRestaurantAdmin(id);

		await restaurantModuleService.deleteRestaurantAdmins(id);

		return new StepResponse(undefined, { admin });
	},
	async ({ admin }: any, { container }) => {
		const restaurantModuleService: RestaurantModuleService =
			container.resolve(RESTAURANT_MODULE);

		const { restaurant: _, ...adminData } = admin;

		await restaurantModuleService.createRestaurantAdmins(adminData);
	}
);
