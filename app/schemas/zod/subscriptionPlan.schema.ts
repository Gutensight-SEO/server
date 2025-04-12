/** @format */


import { object, string, number, boolean, TypeOf } from "zod";

const payload = {
    body: object({
        name: string({ required_error: "Subscription plan name is required" }),
        description: string().optional(),
        priceUSD: number({ required_error: "USD price is required" })
            .min(0, "Price cannot be negative"),
        apiRequestQuota: number({ required_error: "API request quota is required" })
            .min(0, "Quota cannot be negative"),
        durationDays: number()
            .min(1, "Duration must be at least 1 day")
            .default(365),
        isActive: boolean().default(true),
        isFreetier: boolean().default(false)
    })
};

const params = {
    params: object({
        subscriptionPlanId: string({ required_error: "Subscription plan ID is required" })
    })
};

export const createSubscriptionPlanSchema = object({
    ...payload
});

export const getSubscriptionPlanSchema = object({
    ...params
});

export const updateSubscriptionPlanSchema = object({
    ...params,
    ...payload
});

export const deleteSubscriptionPlanSchema = object({
    ...params
});

export type CreateSubscriptionPlanInput = TypeOf<typeof createSubscriptionPlanSchema>;
export type GetSubscriptionPlanInput = TypeOf<typeof getSubscriptionPlanSchema>;
export type UpdateSubscriptionPlanInput = TypeOf<typeof updateSubscriptionPlanSchema>;
export type DeleteSubscriptionPlanInput = TypeOf<typeof deleteSubscriptionPlanSchema>;
