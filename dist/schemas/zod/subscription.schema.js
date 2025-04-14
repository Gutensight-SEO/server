"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionSchema = exports.updateSubscriptionSchema = exports.getSubscriptionSchema = exports.createSubscriptionSchema = void 0;
const zod_1 = require("zod");
const subscriptionStatus = ['active', 'paused', 'expired', 'cancelled'];
const payload = {
    body: (0, zod_1.object)({
        userId: (0, zod_1.string)({ required_error: "User ID is required" }),
        subscriptionPlanId: (0, zod_1.string)({ required_error: "Subscription Plan ID is required" }),
        apiKey: (0, zod_1.string)({ required_error: "API Key is required" }),
        apiSecret: (0, zod_1.string)({ required_error: "API Secret is required" }),
        status: (0, zod_1.enum)(subscriptionStatus, {
            required_error: "Status is required",
            invalid_type_error: "Status must be active, paused, expired, or cancelled"
        }),
        startDate: (0, zod_1.string)({ required_error: "Start date is required" })
            .transform((str) => new Date(str)),
        endDate: (0, zod_1.string)({ required_error: "End date is required" })
            .transform((str) => new Date(str)),
        pausedAt: (0, zod_1.string)().optional()
            .transform((str) => str ? new Date(str) : undefined),
        totalApiRequests: (0, zod_1.number)({ required_error: "Total API requests is required" })
            .min(0, "Total API requests cannot be negative"),
        usedApiRequests: (0, zod_1.number)()
            .min(0, "Used API requests cannot be negative")
            .default(0),
        remainingApiRequests: (0, zod_1.number)({ required_error: "Remaining API requests is required" })
            .min(0, "Remaining API requests cannot be negative"),
        paymentId: (0, zod_1.string)({ required_error: "Payment ID is required" })
    }),
};
const params = {
    params: (0, zod_1.object)({
        subscriptionId: (0, zod_1.string)({ required_error: "Subscription ID is required" }),
    }),
};
exports.createSubscriptionSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.getSubscriptionSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateSubscriptionSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), payload));
exports.deleteSubscriptionSchema = (0, zod_1.object)(Object.assign({}, params));
