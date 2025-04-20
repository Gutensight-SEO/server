/** @format */

import { object, string, number, boolean, TypeOf, enum as zodEnum } from "zod";

const subscriptionStatus = ['active', 'paused', 'expired', 'cancelled'] as const;

const payload = {
    body: object({
        userId: string({ required_error: "User ID is required" }),
        subscriptionPlanId: string({ required_error: "Subscription Plan ID is required" }),
        apiKey: string({ required_error: "API Key is required" }),
        status: zodEnum(subscriptionStatus, {
            required_error: "Status is required",
            invalid_type_error: "Status must be active, paused, expired, or cancelled"
        }),
        startDate: string({ required_error: "Start date is required" })
            .transform((str) => new Date(str)),
        endDate: string({ required_error: "End date is required" })
            .transform((str) => new Date(str)),
        pausedAt: string().optional()
            .transform((str) => str ? new Date(str) : undefined),
        totalApiRequests: number({ required_error: "Total API requests is required" })
            .min(0, "Total API requests cannot be negative"),
        usedApiRequests: number()
            .min(0, "Used API requests cannot be negative")
            .default(0),
        remainingApiRequests: number({ required_error: "Remaining API requests is required" })
            .min(0, "Remaining API requests cannot be negative"),
        paymentId: string({ required_error: "Payment ID is required" })
    }),
};

const params = {
    params: object({
        subscriptionId: string({ required_error: "Subscription ID is required" }),
    }),
};

export const createSubscriptionSchema = object({
    ...payload,
});

export const getSubscriptionSchema = object({
    ...params,
});

export const updateSubscriptionSchema = object({
    ...params,
    ...payload,
});

export const deleteSubscriptionSchema = object({
    ...params,
});

export type CreateSubscriptionInput = TypeOf<typeof createSubscriptionSchema>;
export type GetSubscriptionInput = TypeOf<typeof getSubscriptionSchema>;
export type UpdateSubscriptionInput = TypeOf<typeof updateSubscriptionSchema>;
export type DeleteSubscriptionInput = TypeOf<typeof deleteSubscriptionSchema>;
