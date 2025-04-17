"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionPlanSchema = exports.updateSubscriptionPlanSchema = exports.getSubscriptionPlanSchema = exports.createSubscriptionPlanSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Subscription plan name is required" }),
        description: (0, zod_1.string)().optional(),
        priceUSD: (0, zod_1.number)({ required_error: "USD price is required" })
            .min(0, "Price cannot be negative"),
        apiRequestQuota: (0, zod_1.number)({ required_error: "API request quota is required" })
            .min(0, "Quota cannot be negative"),
        durationDays: (0, zod_1.number)()
            .min(1, "Duration must be at least 1 day")
            .default(365),
        isActive: (0, zod_1.boolean)().default(true),
        isFreetier: (0, zod_1.boolean)().default(false)
    })
};
const params = {
    params: (0, zod_1.object)({
        subscriptionPlanId: (0, zod_1.string)({ required_error: "Subscription plan ID is required" })
    })
};
exports.createSubscriptionPlanSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.getSubscriptionPlanSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateSubscriptionPlanSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), payload));
exports.deleteSubscriptionPlanSchema = (0, zod_1.object)(Object.assign({}, params));
