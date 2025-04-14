/** @format */

import { Router } from "express";
import { SubscriptionPlanController } from "@/controllers";
import { adminMiddleware, authorizationMiddleware, ZodValidation } from "@/middlewares";
import { ZodSchema } from "@/schemas";

const subscriptionPlanRouter = Router();

// get subscription plans
subscriptionPlanRouter.get("/", SubscriptionPlanController.listSubscriptionPlans);
// create subscription plan
subscriptionPlanRouter.post("/", adminMiddleware, ZodValidation(ZodSchema.SubscriptionPlanSchema.createSubscriptionPlanSchema), SubscriptionPlanController.createSubscriptionPlan);
// update subscription plan
subscriptionPlanRouter.patch("/:subscriptionPlanId", adminMiddleware, ZodValidation(ZodSchema.SubscriptionPlanSchema.updateSubscriptionPlanSchema), SubscriptionPlanController.updateSubscriptionPlan);
// delete subscription plan
subscriptionPlanRouter.delete("/:subscriptionPlanId", )


export default subscriptionPlanRouter;
