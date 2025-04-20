/** @format */


import { deleteCache, setCache, updateCache } from "@/cache";
import { STATUS_CODES } from "@/constants";
import { Logs } from "@/monitoring";
import { ZodSchema } from "@/schemas";
import { SubscriptionPlanDocument, SubscriptionPlanModel } from "@/models";
// import { UserSubscription } from "@/models/userSubscription.model";
import crypto from "crypto";
import { omit } from "lodash";

export const listSubscriptionPlans = async () => {
    try {        
        const subscriptionPlans = await SubscriptionPlanModel.find({ 
            isActive: true,
            isFreetier: false,
        });
        console.log("SUB PLANS:", subscriptionPlans)
        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "Subscription plans fetched successfully",
            data: subscriptionPlans
        };
    } catch (error) {
        Logs.error("List Subscriptions Error:", error);
        return {
            statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
            errMessage: "Failed to fetch subscription plans"
        };
    }
};

export const createSubscriptionPlan = async (
    details: ZodSchema.SubscriptionPlanSchema.CreateSubscriptionPlanInput['body']
): Promise<SubscriptionPlanDocument | object | null> => {
    try {

        const foundSubscriptonPlan = await SubscriptionPlanModel.findOne({
            name: details.name
        })

        if (foundSubscriptonPlan) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
            errMessage: "Subscription plan already exist"
        }

        const subscriptionPlan = await SubscriptionPlanModel.create({ details });
        
        if (subscriptionPlan) {
            await setCache(String(subscriptionPlan._id), subscriptionPlan);
            await deleteCache('subscriptionPlans');

            return {
                statusCode: STATUS_CODES.SUCCESS.CREATED,
                message: "Subscription Plan created successfully",
                data: omit(subscriptionPlan.toJSON(), "__v")
            };
        } else return {
            statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
            errMessage: "Failed to create subscription plan"
        }
    } catch (error) {
        Logs.error("Create Subscription plan Error:", error);
        return null;
    }
};

export const updateSubscriptionPlan = async (
    { subscriptionPlanId }: ZodSchema.SubscriptionPlanSchema.UpdateSubscriptionPlanInput["params"],
    details: ZodSchema.SubscriptionPlanSchema.UpdateSubscriptionPlanInput['body']
): Promise<SubscriptionPlanDocument | object | null> => {
    try {
        const foundSubscriptionPlan = await SubscriptionPlanModel.findOne({ _id: subscriptionPlanId });

        if (!foundSubscriptionPlan) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "Subscription plan not found"
        }

        const subscriptionPlan = await SubscriptionPlanModel.findByIdAndUpdate(
            subscriptionPlanId,
            details,
            { new: true }
        )
        
        if (subscriptionPlan) {
            await setCache(String(subscriptionPlan._id), subscriptionPlan);
            await deleteCache('subscriptionPlans');

            return {
                statusCode: STATUS_CODES.SUCCESS.OK,
                message: "Subscription plan updated successfully",
                data: omit(subscriptionPlan.toJSON(), "__v")
            };
        } else return {
            statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
            errMessage: "Failed to create subscription"
        }
    } catch (error) {
        Logs.error("Create Subscription plan Error:", error);
        return null;
    }
};

export const deleteSubscriptionPlan = async (
    { subscriptionPlanId }: ZodSchema.SubscriptionPlanSchema.DeleteSubscriptionPlanInput['params'],
): Promise<object | null> => {
    try {
        const foundSubscription = await SubscriptionPlanModel.findById(subscriptionPlanId);

        if (!foundSubscription) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "Subscription plan not found"
        }

        await deleteCache("subscriptionPlans")

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "Subscription plan deleted successfully"
        }
    } catch (error) {
        Logs.error("Delete Subscripton plan Error:", error);
        return null;
    }
}

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

//         const userSubscription = await UserSubscription.create({
//             userId,
//             subscriptionId,
//             apiKey,
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
