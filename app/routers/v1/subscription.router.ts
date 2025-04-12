/** @format */

import { Router } from "express";
import { SubscriptionController } from "@/controllers";
import { adminMiddleware, authorizationMiddleware, ZodValidation } from "@/middlewares";
import { ZodSchema } from "@/schemas";

const subscriptionRouter = Router();


// list all subscriptions (subscribers) 
subscriptionRouter.get("/subscription", 
    adminMiddleware,
    SubscriptionController.listSubscriptions
);

// subscribe to a plan
subscriptionRouter.post("/subscribe", 
    // ZodValidation(ZodSchema.SubscriptionSchema.createSubscriptionSchema),
    SubscriptionController.subscribe
);

// // get user's API keys
// subscriptionRouter.get("/keys", 
//     // ZodValidation(ZodSchema.SubscriptionSchema.getUserKeysSchema),
//     SubscriptionController.getUserApiKeys
// );

// get subscription details
subscriptionRouter.get("/details/:subscriptionId", 
    SubscriptionController.getSubscriptionDetails
);

// check user's subscription 
subscriptionRouter.get("/check-subscription/:subscriptionId", 
    ZodValidation(ZodSchema.SubscriptionSchema.getSubscriptionSchema),
    SubscriptionController.checkSubscription
);

// pause subscription
subscriptionRouter.post("/pause/:subscriptionId", 
    ZodValidation(ZodSchema.SubscriptionSchema.getSubscriptionSchema),
    SubscriptionController.pauseSubscription
);

// get user subscriptions
subscriptionRouter.get("/user-subscriptions", 
    // ZodValidation(ZodSchema.SubscriptionSchema.getUserSubscriptionsSchema),
    SubscriptionController.getUserSubscriptions
);


export default subscriptionRouter;
