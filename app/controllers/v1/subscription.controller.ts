/** @format */

import { Request, Response } from 'express';
import { errorHandlerWrapper } from "@/helpers";
import asyncHandler from "express-async-handler";
import { v1Services } from "@/services";
import { KAFKA_TOPICS, STATUS_CODES } from "@/constants";
import { getOrSetCache } from '@/cache';
import { Logs } from '@/monitoring';
import { ZodSchema } from "@/schemas";
import crypto from "crypto";
import { producer } from '@/streaming';

const listSubscriptionsHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
      const results = await getOrSetCache('subscriptions', () => v1Services.listSubscriptions());

      if (results) {
        if (results['errMessage']) {
          res.status(results['statusCode']).json({
              success: false,
              message: results['errMessage'],
              data: []
          });
          return;
        } else {
          res.status(STATUS_CODES.SUCCESS.OK).json({
            success: true,
            message: "Subscriptions fetched successfully",
            data: results
          });
          return;
        }
      } else {
        res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
            success: false,
            message: "Fetching Subscriptions Failed"
        });
        return;
      }
    } catch (error) {
        Logs.error("List Subscriptions Handler Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return; 
    }
});

const subscribeHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }

        const userId = req.user.id;
        const { subscriptionPlanId, paymentId } = req.body;

        if (!subscriptionPlanId || !paymentId) {
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "No subscription details"
            });
            return;
        } 

        const correlationId = await producer.publish(
            KAFKA_TOPICS.SUBSCRIBE,
            () => v1Services.subscribe(userId, subscriptionPlanId, paymentId)
        );

        res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Subscription in progress",
            correlationId
        });
    } catch (error) {
        Logs.error("Subscription Handler Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return; 
    }
});

const getSubscriptionDetailsHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }
        const userId = req.user.id;
        const subscriptionId = req.params.subscriptionId;
        // console.log("SUBSCIRIPTION ID:", subscriptionId)

        if (!subscriptionId) {
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Subscription ID is required"
            });
            return;
        }

        const result = await v1Services.getSubscriptionDetails(userId, subscriptionId);
        
        if (result && typeof result !== null) {
            if (typeof result === 'object' && 'errMessage' in result && 'statusCode' in result) {
                res.status(result['statusCode'] as number).json({
                    success: false,
                    message: result['errMessage'],
                });
                return;
            } else {
                res.status(STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }
        } else {
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Failed to fetch API keys"
            });
            return
        }
    } catch (error) {
        Logs.error("Get API Keys Handler Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
    }
});

const checkSubscriptionHandler = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized access"
                });
                return;
            }
            const results = await getOrSetCache(
                `${req.user.id}_checkSubscription`, 
                () => v1Services.checkSubscription(req.user!.id, req.params.subscriptionId)
            );
        
            if (results) {
                if (results['errMessage']) {
                    res.status(results['statusCode']).json({
                        success: false,
                        message: results['errMessage'],
                        data: []
                    });
                    return;
                } else {
                    res.status(STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "User Subscriptions fetched successfully",
                    data: results
                    });
                    return;
                }
            } else {
                res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                    success: false,
                    message: "Fetching Subscription failed"
                });
                return;
            }
        } catch (error) {
            Logs.error("List Subscription Handler Error:", error);
            res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server Error! Please Try Again Later"
            });
            return; 
        }
    }
);

const pauseSubscriptionHandler = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }
        try {
            const userId = req.user.id;
            const subscriptionId = req.params.subscriptionId;
    
            if (!subscriptionId) {
                res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                    success: false,
                    message: "Select a subscription to pause"
                });
                return;
            } 
    
            const correlationId = await producer.publish(
                KAFKA_TOPICS.PAUSE_SUBSCRIPTION,
                () => v1Services.pauseSubscription(userId, subscriptionId)
            );
            
            res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
                success: true,
                message: "Pausing Subscription in progress",
                correlationId
            });
        } catch (error) {
            Logs.error("Pause Subscription Handler Error:", error);
            res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server Error! Please Try Again Later"
            });
            return; 
        }
    }
);

const getUserSubscriptionsHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized access"
            });
            return;
        }
        const userId = req.user.id;
        const activeOnly = req.query.active === 'true';

        const results = await getOrSetCache(
            `${userId}_userSubscriptions`, 
            () => v1Services.getUserSubscriptions(userId, activeOnly)
        );
    
        if (results) {
            if (results['errMessage']) {
                res.status(STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: results['errMessage'],
                    data: [] // Return empty array instead of error
                });
                return;
            } else {
                res.status(STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "User Subscription fetched successfully",
                    data: results
                });
                return;
            }
        }

        // Return empty array if no results
        res.status(STATUS_CODES.SUCCESS.OK).json({
            success: true,
            message: "No subscriptions found",
            data: []
        });
    } catch (error) {
        Logs.error("Get User Subscription Handler Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return; 
    }
});

export const listSubscriptions = errorHandlerWrapper(listSubscriptionsHandler);
export const subscribe = errorHandlerWrapper(subscribeHandler);
export const getSubscriptionDetails = errorHandlerWrapper(getSubscriptionDetailsHandler);
export const checkSubscription = errorHandlerWrapper(checkSubscriptionHandler);
export const pauseSubscription = errorHandlerWrapper(pauseSubscriptionHandler);
export const getUserSubscriptions = errorHandlerWrapper(getUserSubscriptionsHandler);