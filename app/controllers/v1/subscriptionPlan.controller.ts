/** @format */

import { Request, Response } from 'express';
import { errorHandlerWrapper } from "@/helpers";
import asyncHandler from "express-async-handler";
import { v1Services } from "@/services";
import { producer } from "@/streaming";
import { KAFKA_TOPICS, STATUS_CODES } from "@/constants";
import { getOrSetCache } from '@/cache';
import { Logs } from '@/monitoring';
import { ZodSchema } from "@/schemas";


const listSubscriptionPlansHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
      const results = await getOrSetCache('subscriptionPlans', () => v1Services.listSubscriptionPlans());

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
      Logs.error("List Subscription plans Handler Error:", error);
      res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Server Error! Please Try Again Later"
      });
      return; 
    }
});

const createSubscriptionPlanHandler = asyncHandler(
  async (
    req: Request<{}, {}, ZodSchema.SubscriptionPlanSchema.CreateSubscriptionPlanInput['body']>, 
    res: Response
  ) => {
    try {
      const correlationId = await producer.publish(
        KAFKA_TOPICS.CREATE_SUBSCRIPTION_PLAN,
        () => v1Services.createSubscriptionPlan(req.body)
      );

      res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
          success: true,
          message: "Subscription plan creation in progress",
          correlationId
      });
    } catch (error) {
      Logs.error("Create Subscription plan Handler Error:", error);
      res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Server Error! Please Try Again Later"
      });
      return; 
    }
});

const updateSubscriptionPlanHandler = asyncHandler(
  async (
    req: Request<ZodSchema.SubscriptionPlanSchema.UpdateSubscriptionPlanInput['params'], {}, ZodSchema.SubscriptionPlanSchema.UpdateSubscriptionPlanInput['body']>, 
    res: Response
  ) => {
    try {

      const correlationId = await producer.publish(
        KAFKA_TOPICS.UPDATE_SUBSCRIPTION_PLAN,
        () => v1Services.updateSubscriptionPlan(req.params, req.body)
      );
  
      res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
          success: true,
          message: "Post update in progress",
          correlationId
      });
    } catch (error) {
      Logs.error("Update Subscription plan Handler Error:", error);
      res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Server Error! Please Try Again Later"
      });
      return; 
    }
});

const deleteSubscriptionPlanHandler = asyncHandler(
  async (
    req: Request<ZodSchema.SubscriptionPlanSchema.DeleteSubscriptionPlanInput['params']>,
    res: Response
  ) => {
    try {
      const correlationId = await producer.publish(
        KAFKA_TOPICS.DELETE_SUBSCRIPTION_PLAN,
        () => v1Services.deleteSubscriptionPlan(req.params)
      );

      res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
        success: true,
        message: "Delete Subscription plan in progress",
        correlationId
      })
    } catch (error) {
      Logs.error("Delete Subscription plan Handler Error:", error);
      res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Server Error! Please Try Again Later"
      });
      return; 
    }
  }
)

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

export const listSubscriptionPlans  = errorHandlerWrapper(listSubscriptionPlansHandler);
export const createSubscriptionPlan = errorHandlerWrapper(createSubscriptionPlanHandler);
export const updateSubscriptionPlan = errorHandlerWrapper(updateSubscriptionPlanHandler);
export const deleteSubscriptionPlan = errorHandlerWrapper(deleteSubscriptionPlanHandler);
// export const getUserApiKeys = errorHandlerWrapper(getUserApiKeysHandler);