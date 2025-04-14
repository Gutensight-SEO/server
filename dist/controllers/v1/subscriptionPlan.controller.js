"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = exports.listSubscriptionPlans = void 0;
const helpers_1 = require("@/helpers");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const services_1 = require("@/services");
const streaming_1 = require("@/streaming");
const constants_1 = require("@/constants");
const cache_1 = require("@/cache");
const monitoring_1 = require("@/monitoring");
const listSubscriptionPlansHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const results = await (0, cache_1.getOrSetCache)('subscriptionPlans', () => services_1.v1Services.listSubscriptionPlans());
        if (results) {
            if (results['errMessage']) {
                res.status(results['statusCode']).json({
                    success: false,
                    message: results['errMessage'],
                    data: []
                });
                return;
            }
            else {
                res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "Subscriptions fetched successfully",
                    data: results
                });
                return;
            }
        }
        else {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Fetching Subscriptions Failed"
            });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("List Subscription plans Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const createSubscriptionPlanHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.CREATE_SUBSCRIPTION_PLAN, () => services_1.v1Services.createSubscriptionPlan(req.body));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Subscription plan creation in progress",
            correlationId
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Create Subscription plan Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const updateSubscriptionPlanHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.UPDATE_SUBSCRIPTION_PLAN, () => services_1.v1Services.updateSubscriptionPlan({ subscriptionPlanId: req.params.subscriptionPlanId }, req.body));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Post update in progress",
            correlationId
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Update Subscription plan Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const deleteSubscriptionPlanHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.DELETE_SUBSCRIPTION_PLAN, () => services_1.v1Services.deleteSubscriptionPlan({ subscriptionPlanId: req.params.subscriptionPlanId }));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Delete Subscription plan in progress",
            correlationId
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Delete Subscription plan Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
// const getUserApiKeysHandler = asyncHandler(async (req: Request, res: Response) => {
//     const result = await v1Services.getUserApiKeys(req.user.id);
//     if (result.errMessage) {
//         res.status(result.statusCode).json({
//             success: false,
//             message: result.errMessage
//         });
//         return;
//     }
//     res.status(result.statusCode).json({
//         success: true,
//         message: result.message,
//         data: result.data
//     });
// });
exports.listSubscriptionPlans = (0, helpers_1.errorHandlerWrapper)(listSubscriptionPlansHandler);
exports.createSubscriptionPlan = (0, helpers_1.errorHandlerWrapper)(createSubscriptionPlanHandler);
exports.updateSubscriptionPlan = (0, helpers_1.errorHandlerWrapper)(updateSubscriptionPlanHandler);
exports.deleteSubscriptionPlan = (0, helpers_1.errorHandlerWrapper)(deleteSubscriptionPlanHandler);
// export const getUserApiKeys = errorHandlerWrapper(getUserApiKeysHandler);
