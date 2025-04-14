"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSubscriptions = exports.pauseSubscription = exports.checkSubscription = exports.getSubscriptionDetails = exports.subscribe = exports.listSubscriptions = void 0;
const helpers_1 = require("@/helpers");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const services_1 = require("@/services");
const constants_1 = require("@/constants");
const cache_1 = require("@/cache");
const monitoring_1 = require("@/monitoring");
const streaming_1 = require("@/streaming");
const listSubscriptionsHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const results = await (0, cache_1.getOrSetCache)('subscriptions', () => services_1.v1Services.listSubscriptions());
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
        monitoring_1.Logs.error("List Subscriptions Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const subscribeHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }
        const userId = req.user.id;
        const { subscriptionPlanId, paymentId } = req.body;
        if (!subscriptionPlanId || !paymentId) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "No subscription details"
            });
            return;
        }
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.SUBSCRIBE, () => services_1.v1Services.subscribe(userId, subscriptionPlanId, paymentId));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Subscription in progress",
            correlationId
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Subscription Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const getSubscriptionDetailsHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }
        const userId = req.user.id;
        const subscriptionId = req.params.subscriptionId;
        // console.log("SUBSCIRIPTION ID:", subscriptionId)
        if (!subscriptionId) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Subscription ID is required"
            });
            return;
        }
        const result = await services_1.v1Services.getSubscriptionDetails(userId, subscriptionId);
        if (result && typeof result !== null) {
            if (typeof result === 'object' && 'errMessage' in result && 'statusCode' in result) {
                res.status(result['statusCode']).json({
                    success: false,
                    message: result['errMessage'],
                });
                return;
            }
            else {
                res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }
        }
        else {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Failed to fetch API keys"
            });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Get API Keys Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
    }
});
const checkSubscriptionHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }
        const results = await (0, cache_1.getOrSetCache)(`${req.user.id}_checkSubscription`, () => services_1.v1Services.checkSubscription(req.user.id, req.params.subscriptionId));
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
                    message: "User Subscriptions fetched successfully",
                    data: results
                });
                return;
            }
        }
        else {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Fetching Subscription failed"
            });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("List Subscription Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const pauseSubscriptionHandler = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user) {
        res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized access"
        });
        return;
    }
    try {
        const userId = req.user.id;
        const subscriptionId = req.params.subscriptionId;
        if (!subscriptionId) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Select a subscription to pause"
            });
            return;
        }
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.PAUSE_SUBSCRIPTION, () => services_1.v1Services.pauseSubscription(userId, subscriptionId));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Pausing Subscription in progress",
            correlationId
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Pause Subscription Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const getUserSubscriptionsHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }
        const userId = req.user.id;
        const activeOnly = req.query.active === 'true';
        const results = await (0, cache_1.getOrSetCache)(`${userId}_userSubscriptions`, () => services_1.v1Services.getUserSubscriptions(userId, activeOnly));
        if (results) {
            if (results['errMessage']) {
                res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: results['errMessage'],
                    data: [] // Return empty array instead of error
                });
                return;
            }
            else {
                res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "User Subscription fetched successfully",
                    data: results
                });
                return;
            }
        }
        // Return empty array if no results
        res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
            success: true,
            message: "No subscriptions found",
            data: []
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Get User Subscription Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
exports.listSubscriptions = (0, helpers_1.errorHandlerWrapper)(listSubscriptionsHandler);
exports.subscribe = (0, helpers_1.errorHandlerWrapper)(subscribeHandler);
exports.getSubscriptionDetails = (0, helpers_1.errorHandlerWrapper)(getSubscriptionDetailsHandler);
exports.checkSubscription = (0, helpers_1.errorHandlerWrapper)(checkSubscriptionHandler);
exports.pauseSubscription = (0, helpers_1.errorHandlerWrapper)(pauseSubscriptionHandler);
exports.getUserSubscriptions = (0, helpers_1.errorHandlerWrapper)(getUserSubscriptionsHandler);
