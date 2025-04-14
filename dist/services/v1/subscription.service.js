"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSubscriptions = exports.pauseSubscription = exports.checkSubscription = exports.getSubscriptionDetails = exports.subscribe = exports.listSubscriptions = void 0;
const constants_1 = require("@/constants");
const monitoring_1 = require("@/monitoring");
// import { ZodSchema } from "@/schemas";
const models_1 = require("@/models");
// import crypto from "crypto";
const lodash_1 = require("lodash");
const utils_1 = require("@/utils");
const listSubscriptions = async () => {
    try {
        const subscriptions = await models_1.SubscriptionModel.find({
            isActive: true,
        });
        console.log("Subscriptions:", subscriptions);
        if (subscriptions.length > 0)
            return subscriptions;
        else
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "No subscription plans yet"
            };
    }
    catch (error) {
        monitoring_1.Logs.error("List Subscriptions Error:", error);
        return null;
    }
};
exports.listSubscriptions = listSubscriptions;
const subscribe = async (userId, subscriptionPlanId, paymentId) => {
    try {
        // Get subscription plan details
        const subscriptionPlan = await models_1.SubscriptionPlanModel.findById(subscriptionPlanId);
        if (!subscriptionPlan) {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription plan not found"
            };
        }
        // verify payment from paystack
        const verifiedPayment = await (0, utils_1.VerifyPayment)(paymentId);
        if (!verifiedPayment) {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                message: "Invalid payment"
            };
        }
        else if (verifiedPayment) {
            // Generate API credentials
            const apiKey = (0, utils_1.generateApiKey)();
            const apiSecret = (0, utils_1.generateApiKey)(48); // Longer secret
            // Encrypt for storage
            const encryptedKey = (0, utils_1.encryptApiKey)(apiKey);
            const encryptedSecret = (0, utils_1.encryptApiKey)(apiSecret);
            // Hash for lookups
            const key_hash = (0, utils_1.encryptApiKey)(apiKey);
            const secret_hash = (0, utils_1.encryptApiKey)(apiSecret);
            // Calculate dates
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + subscriptionPlan.durationDays);
            const subscription = await models_1.SubscriptionModel.create({
                userId,
                subscriptionPlanId,
                apiKey: encryptedKey,
                apiSecret: encryptedSecret,
                startDate,
                endDate,
                totalApiRequests: subscriptionPlan.apiRequestQuota,
                remainingApiRequests: subscriptionPlan.apiRequestQuota,
                paymentId
            });
            if (subscription) {
                const key_hash = (0, utils_1.encryptApiKey)(apiKey);
                const secret_hash = (0, utils_1.encryptApiKey)(apiSecret);
                const savedApiKeys = await models_1.ApiKeyModel.create({
                    subscription_name: subscriptionPlan.name,
                    subscription_id: subscription._id,
                    key_hash,
                    secret_hash,
                    userId,
                    requests_remaining: subscriptionPlan.apiRequestQuota,
                    created_at: new Date(),
                });
                if (savedApiKeys)
                    return {
                        statusCode: constants_1.STATUS_CODES.SUCCESS.CREATED,
                        message: "Subscription created successfully",
                        data: (0, lodash_1.omit)(subscription.toJSON(), ["__v"])
                    };
            }
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Create Subscription Error:", error);
        return null;
    }
};
exports.subscribe = subscribe;
const getSubscriptionDetails = async (userId, subscriptionId) => {
    try {
        const subscription = await models_1.SubscriptionModel.findOne({
            _id: subscriptionId,
            userId
        })
            .populate('subscriptionPlanId', 'name description apiRequestQuota durationDays')
            .exec();
        console.log("SUBSCRIPTION:", subscription);
        if (!subscription) {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                message: "Subscription not found"
            };
        }
        // Calculate remaining days
        const now = new Date();
        const endDate = new Date(subscription.endDate);
        const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        // Only try to decrypt if both keys exist
        const apiKey = subscription.apiKey ? (0, utils_1.decryptApiKey)(subscription.apiKey) : '';
        const apiSecret = subscription.apiSecret ? (0, utils_1.decryptApiKey)(subscription.apiSecret) : '';
        return {
            statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
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
                    apiSecret
                }
            }
        };
    }
    catch (error) {
        monitoring_1.Logs.error("Get Subscription Details Error:", error);
        return null;
    }
};
exports.getSubscriptionDetails = getSubscriptionDetails;
const checkSubscription = async (userId, subscriptionId) => {
    try {
        const subscription = await models_1.SubscriptionModel.findOne({ _id: subscriptionId, userId }).populate('subscriptionPlanId');
        if (!subscription) {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription not found"
            };
        }
        return {
            statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
            data: (0, lodash_1.omit)(subscription.toJSON(), ["apiKey", "apiSecret", "__v"])
        };
    }
    catch (error) {
        monitoring_1.Logs.error("Check Subscription Error:", error);
        return null;
    }
};
exports.checkSubscription = checkSubscription;
const pauseSubscription = async (userId, subscriptionId) => {
    try {
        const subscription = await models_1.SubscriptionModel.findOne({
            _id: subscriptionId,
            userId,
            status: 'active'
        });
        if (!subscription) {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Active subscription not found"
            };
        }
        subscription.status = 'paused';
        subscription.pausedAt = new Date();
        await subscription.save();
        return {
            statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
            message: "Subscription paused successfully",
            data: (0, lodash_1.omit)(subscription.toJSON(), ["apiKey", "apiSecret", "__v"])
        };
    }
    catch (error) {
        monitoring_1.Logs.error("Pause Subscription Error:", error);
        return null;
    }
};
exports.pauseSubscription = pauseSubscription;
const getUserSubscriptions = async (userId, activeOnly = false) => {
    try {
        const query = { userId };
        if (activeOnly) {
            query['status'] = 'active';
        }
        const subscriptions = await models_1.SubscriptionModel.find(query);
        // .populate('userId')
        // .populate('subscriptionPlanId')
        // .exec();
        // console.log("USER SUBS:", subscriptions)
        if (subscriptions.length > 0) {
            return subscriptions.map(sub => (0, lodash_1.omit)(sub.toJSON(), ["apiKey", "apiSecret", "__v"]));
        }
        else {
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription not found"
            };
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Get User Subscriptions Error:", error);
        return null;
    }
};
exports.getUserSubscriptions = getUserSubscriptions;
