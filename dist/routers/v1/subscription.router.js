"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const middlewares_1 = require("@/middlewares");
const schemas_1 = require("@/schemas");
const subscriptionRouter = (0, express_1.Router)();
// list all subscriptions (subscribers) 
subscriptionRouter.get("/subscription", middlewares_1.adminMiddleware, controllers_1.SubscriptionController.listSubscriptions);
// subscribe to a plan
subscriptionRouter.post("/subscribe", 
// ZodValidation(ZodSchema.SubscriptionSchema.createSubscriptionSchema),
controllers_1.SubscriptionController.subscribe);
// // get user's API keys
// subscriptionRouter.get("/keys", 
//     // ZodValidation(ZodSchema.SubscriptionSchema.getUserKeysSchema),
//     SubscriptionController.getUserApiKeys
// );
// get subscription details
subscriptionRouter.get("/details/:subscriptionId", controllers_1.SubscriptionController.getSubscriptionDetails);
// check user's subscription 
subscriptionRouter.get("/check-subscription/:subscriptionId", (0, middlewares_1.ZodValidation)(schemas_1.ZodSchema.SubscriptionSchema.getSubscriptionSchema), controllers_1.SubscriptionController.checkSubscription);
// pause subscription
subscriptionRouter.post("/pause/:subscriptionId", (0, middlewares_1.ZodValidation)(schemas_1.ZodSchema.SubscriptionSchema.getSubscriptionSchema), controllers_1.SubscriptionController.pauseSubscription);
// get user subscriptions
subscriptionRouter.get("/user-subscriptions", 
// ZodValidation(ZodSchema.SubscriptionSchema.getUserSubscriptionsSchema),
controllers_1.SubscriptionController.getUserSubscriptions);
exports.default = subscriptionRouter;
