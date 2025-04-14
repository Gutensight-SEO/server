"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const schemas_1 = require("../../schemas");
const subscriptionPlanRouter = (0, express_1.Router)();
// get subscription plans
subscriptionPlanRouter.get("/", controllers_1.SubscriptionPlanController.listSubscriptionPlans);
// create subscription plan
subscriptionPlanRouter.post("/", middlewares_1.adminMiddleware, (0, middlewares_1.ZodValidation)(schemas_1.ZodSchema.SubscriptionPlanSchema.createSubscriptionPlanSchema), controllers_1.SubscriptionPlanController.createSubscriptionPlan);
// update subscription plan
subscriptionPlanRouter.patch("/:subscriptionPlanId", middlewares_1.adminMiddleware, (0, middlewares_1.ZodValidation)(schemas_1.ZodSchema.SubscriptionPlanSchema.updateSubscriptionPlanSchema), controllers_1.SubscriptionPlanController.updateSubscriptionPlan);
// delete subscription plan
subscriptionPlanRouter.delete("/:subscriptionPlanId");
exports.default = subscriptionPlanRouter;
