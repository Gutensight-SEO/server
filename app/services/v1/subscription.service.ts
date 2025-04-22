/** @format */

import { deleteCache, setCache, updateCache } from "@/cache";
import { STATUS_CODES } from "@/constants";
import { Logs } from "@/monitoring";
// import { ZodSchema } from "@/schemas";
import { ApiKeyModel, SubscriptionDocument, SubscriptionModel, SubscriptionPlanModel, SubscriptionPlanDocument } from "@/models";
// import crypto from "crypto";
import { omit } from "lodash";
import { decryptApiKey, encryptApiKey, generateApiKey, hashApiKey, VerifyPayment } from "@/utils";

// Update the interface to use Document type
interface PopulatedSubscription extends Omit<SubscriptionDocument, 'subscriptionPlanId'> {
  subscriptionPlanId: SubscriptionPlanDocument;
}

export const listSubscriptions = async (): Promise<SubscriptionDocument[] | object | null> => {
    try {
        const subscriptions = await SubscriptionModel.find({ 
            isActive: true, 
        });

        console.log("Subscriptions:", subscriptions);
        
        if (subscriptions.length > 0) return subscriptions
        else return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "No subscription plans yet"
        };
    } catch (error) {
        Logs.error("List Subscriptions Error:", error);
        return null;
    }
};

export const subscribe = async (
    userId: string,
    subscriptionPlanId: string,
    paymentId: string
) => {
    try {
        // Get subscription plan details
        const subscriptionPlan = await SubscriptionPlanModel.findById(subscriptionPlanId);
        if (!subscriptionPlan) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription plan not found"
            };
        }

        // verify payment from paystack
        const verifiedPayment = await VerifyPayment(paymentId);

        if (!verifiedPayment) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                message: "Invalid payment"
            }
        } else if (verifiedPayment) {
            // Generate API credentials
            const apiKey = generateApiKey();
            
            // // Encrypt for storage
            const encryptedKey = encryptApiKey(apiKey);
            
            // Hash for lookups
            const key_hash = hashApiKey(apiKey);
            
            // Calculate dates
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + subscriptionPlan.durationDays);

            const subscription = await SubscriptionModel.create({
                userId,
                subscriptionPlanId,
                apiKey: encryptedKey,
                apiKeyHash: key_hash,
                status: 'active',
                startDate,
                endDate,
                totalApiRequests: subscriptionPlan.apiRequestQuota,
                remainingApiRequests: subscriptionPlan.apiRequestQuota,
                paymentId
            });

            if (subscription) {
                // const key_hash = hashApiKey(apiKey);

                const savedApiKeys = await ApiKeyModel.create({
                    subscription_name: subscriptionPlan.name,
                    subscription_id: subscription._id,
                    key_hash,
                    userId,
                    requests_remaining: subscriptionPlan.apiRequestQuota,
                    created_at: new Date(),
                });

                if (savedApiKeys)
                    return {
                        statusCode: STATUS_CODES.SUCCESS.CREATED,
                        message: "Subscription created successfully",
                        data: omit(subscription.toJSON(), ["__v"])
                    };
            }
        }

    } catch (error) {
        Logs.error("Create Subscription Error:", error);
        return null;
    }
};

export const getSubscriptionDetails = async (userId: string, subscriptionId: string) => {
    try {
        const subscription = await SubscriptionModel.findOne({
            _id: subscriptionId,
            userId
        })
        .populate<{ subscriptionPlanId: SubscriptionPlanDocument }>('subscriptionPlanId', 'name description apiRequestQuota durationDays')
        .exec();

        console.log("SUBSCRIPTION:", subscription)

        if (!subscription) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                message: "Subscription not found"
            };
        }

        // Calculate remaining days
        const now = new Date();
        const endDate = new Date(subscription.endDate);
        const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Only try to decrypt if key exist
        const apiKey = decryptApiKey(subscription.apiKey);
        // console.log("ENCRYPTED API KEY from sub details:", subscription.apiKey);
        // console.log("DECRYPTED API KEY from sub details:", apiKey);
        // console.log("RE-ENCRYPTED API KEY from sub details:", encryptApiKey(apiKey));

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "Subscription details fetched successfully",
            data: {
                subscription: {
                    id: subscription._id,
                    name: subscription.subscriptionPlanId.name,
                    description: subscription.subscriptionPlanId.description,
                    durationDays: remainingDays,
                    status: subscription.status,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    totalApiRequests: subscription.totalApiRequests,
                    remainingApiRequests: subscription.remainingApiRequests,
                },
                keys: {
                    apiKey,
                }
            }
        };
    } catch (error) {
        Logs.error("Get Subscription Details Error:", error);
        return null;
    }
};

export const checkSubscription = async (userId: string, subscriptionId: string) => {
    try {
        const subscription = await SubscriptionModel.findOne(
            { _id: subscriptionId, userId }).populate('subscriptionPlanId');
            
        if (!subscription) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription not found"
            };
        }

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            data: omit(subscription.toJSON(), ["apiKey", "__v"])
        };
    } catch (error) {
        Logs.error("Check Subscription Error:", error);
        return null;
    }
};

export const pauseSubscription = async (
    userId: string,
    subscriptionId: string,) => {
    try {
        const subscription = await SubscriptionModel.findOne({ 
            _id: subscriptionId, 
            userId,
            status: 'active'
        });

        if (!subscription) {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Active subscription not found"
            };
        }

        subscription.status = 'paused';
        subscription.pausedAt = new Date();
        await subscription.save();

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "Subscription paused successfully",
            data: omit(subscription.toJSON(), ["apiKey", "__v"])
        };
    } catch (error) {
        Logs.error("Pause Subscription Error:", error);
        return null;
    }
};

export const getUserSubscriptions = async (userId: string, activeOnly = false) => {
    try {
        const query: Record<string, any> = { userId };
        if (activeOnly) {
            query['status'] = 'active';
        }

        const subscriptions = await SubscriptionModel.find(query)
            // .populate('userId')
            // .populate('subscriptionPlanId')
            // .exec();

        // console.log("USER SUBS:", subscriptions)

        if (subscriptions.length > 0) {
            return subscriptions.map(sub => omit(sub.toJSON(), ["apiKey", "__v"]));
        } else {
            return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription not found"
            };
        }
    } catch (error) {
        Logs.error("Get User Subscriptions Error:", error);
        return null;
    }
};
