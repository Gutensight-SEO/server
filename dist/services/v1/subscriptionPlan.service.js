"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = exports.listSubscriptionPlans = void 0;
const cache_1 = require("@/cache");
const constants_1 = require("@/constants");
const monitoring_1 = require("@/monitoring");
const models_1 = require("@/models");
const lodash_1 = require("lodash");
const listSubscriptionPlans = async () => {
    try {
        const subscriptionPlans = await models_1.SubscriptionPlanModel.find({
            isActive: true,
            isFreetier: false,
        });
        console.log("SUB PLANS:", subscriptionPlans);
        return {
            statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
            message: "Subscription plans fetched successfully",
            data: subscriptionPlans
        };
    }
    catch (error) {
        monitoring_1.Logs.error("List Subscriptions Error:", error);
        return {
            statusCode: constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
            errMessage: "Failed to fetch subscription plans"
        };
    }
};
exports.listSubscriptionPlans = listSubscriptionPlans;
const createSubscriptionPlan = async (details) => {
    try {
        const foundSubscriptonPlan = await models_1.SubscriptionPlanModel.findOne({
            name: details.name
        });
        if (foundSubscriptonPlan)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "Subscription plan already exist"
            };
        const subscriptionPlan = await models_1.SubscriptionPlanModel.create({ details });
        if (subscriptionPlan) {
            await (0, cache_1.setCache)(String(subscriptionPlan._id), subscriptionPlan);
            await (0, cache_1.deleteCache)('subscriptionPlans');
            return {
                statusCode: constants_1.STATUS_CODES.SUCCESS.CREATED,
                message: "Subscription Plan created successfully",
                data: (0, lodash_1.omit)(subscriptionPlan.toJSON(), "__v")
            };
        }
        else
            return {
                statusCode: constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
                errMessage: "Failed to create subscription plan"
            };
    }
    catch (error) {
        monitoring_1.Logs.error("Create Subscription plan Error:", error);
        return null;
    }
};
exports.createSubscriptionPlan = createSubscriptionPlan;
const updateSubscriptionPlan = async ({ subscriptionPlanId }, details) => {
    try {
        const foundSubscriptionPlan = await models_1.SubscriptionPlanModel.findOne({ _id: subscriptionPlanId });
        if (!foundSubscriptionPlan)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription plan not found"
            };
        const subscriptionPlan = await models_1.SubscriptionPlanModel.findByIdAndUpdate(subscriptionPlanId, details, { new: true });
        if (subscriptionPlan) {
            await (0, cache_1.setCache)(String(subscriptionPlan._id), subscriptionPlan);
            await (0, cache_1.deleteCache)('subscriptionPlans');
            return {
                statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
                message: "Subscription plan updated successfully",
                data: (0, lodash_1.omit)(subscriptionPlan.toJSON(), "__v")
            };
        }
        else
            return {
                statusCode: constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
                errMessage: "Failed to create subscription"
            };
    }
    catch (error) {
        monitoring_1.Logs.error("Create Subscription plan Error:", error);
        return null;
    }
};
exports.updateSubscriptionPlan = updateSubscriptionPlan;
const deleteSubscriptionPlan = async ({ subscriptionPlanId }) => {
    try {
        const foundSubscription = await models_1.SubscriptionPlanModel.findById(subscriptionPlanId);
        if (!foundSubscription)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "Subscription plan not found"
            };
        await (0, cache_1.deleteCache)("subscriptionPlans");
        return {
            statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
            message: "Subscription plan deleted successfully"
        };
    }
    catch (error) {
        monitoring_1.Logs.error("Delete Subscripton plan Error:", error);
        return null;
    }
};
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
// export const createUserSubscription = async (payload: {
//     userId: string;
//     subscriptionId: string;
//     paymentType: string;
// }) => {
//     try {
//         const { userId, subscriptionId, paymentType } = payload;
//         const subscription = await Subscription.findById(subscriptionId);
//         if (!subscription) {
//             return {
//                 statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
//                 errMessage: "Subscription not found"
//             };
//         }
//         const apiKey = crypto.randomBytes(16).toString('hex');
//         const apiSecret = crypto.randomBytes(32).toString('hex');
//         const userSubscription = await UserSubscription.create({
//             userId,
//             subscriptionId,
//             apiKey,
//             apiSecret,
//             startDate: new Date(),
//             endDate: new Date(Date.now() + subscription.durationDays * 24 * 60 * 60 * 1000),
//             totalRequests: subscription.apiRequestQuota,
//             remainingRequests: subscription.apiRequestQuota,
//             paymentType
//         });
//         return {
//             statusCode: STATUS_CODES.SUCCESS.CREATED,
//             message: "User subscription created successfully",
//             data: userSubscription
//         };
//     } catch (error) {
//         Logs.error("Create User Subscription Error:", error);
//         return {
//             statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
//             errMessage: "Failed to create user subscription"
//         };
//     }
// };
// export const getUserApiKeys = async (userId: string) => {
//     try {
//         const subscriptions = await UserSubscription.find({ userId })
//             .populate('subscriptionId');
//         return {
//             statusCode: STATUS_CODES.SUCCESS.OK,
//             message: "API keys fetched successfully",
//             data: subscriptions
//         };
//     } catch (error) {
//         Logs.error("Get User API Keys Error:", error);
//         return {
//             statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
//             errMessage: "Failed to fetch API keys"
//         };
//     }
// };
