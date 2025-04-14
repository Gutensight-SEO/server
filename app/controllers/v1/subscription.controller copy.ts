// import { Request, Response } from 'express';
// import { errorHandlerWrapper } from "@/helpers";
// import asyncHandler from "express-async-handler";
// import { v1Services } from "@/services";
// import { STATUS_CODES } from "@/constants";
// import { getOrSetCache } from '@/cache';
// import { Logs } from '@/monitoring';
// import { ZodSchema } from "@/schemas";
// import crypto from "crypto";

// const listSubscriptionsHandler = asyncHandler(async (req: Request, res: Response) => {
//     try {
//       const results = await getOrSetCache('subscriptions', () => v1Services.listSubscriptions());

//       if (results) {
//         if (results['errMessage']) {
//           res.status(results['statusCode']).json({
//               success: false,
//               message: results['errMessage'],
//               data: []
//           });
//           return;
//         } else {
//           res.status(STATUS_CODES.SUCCESS.OK).json({
//             success: true,
//             message: "Subscriptions fetched successfully",
//             data: results
//           });
//           return;
//         }
//       } else {
//         res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
//             success: false,
//             message: "Fetching Subscriptions Failed"
//         });
//         return;
//       }
//     } catch (error) {
//       Logs.error("List Subscriptions Handler Error:", error);
//       res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
//           success: false,
//           message: "Server Error! Please Try Again Later"
//       });
//       return; 
//     }
// });

// const createSubscriptionHandler = asyncHandler(async (req: Request, res: Response) => {
//     const result = await v1Services.createSubscription(req.body);
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

// const getUserSubscriptionsHandler = asyncHandler(async (req: Request, res: Response) => {
//     try {
//         const activeOnly = req.query.active === 'true';
//         const result = await v1Services.getUserSubscriptions(req.user.id, activeOnly);

//         if (result.errMessage) {
//             res.status(result.statusCode).json({
//                 success: false,
//                 message: result.errMessage
//             });
//             return;
//         }

//         res.status(result.statusCode).json({
//             success: true,
//             data: result.data
//         });
//     } catch (error) {
//         Logs.error("Get User Subscriptions Handler Error:", error);
//         res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Server Error! Please Try Again Later"
//         });
//     }
// });

// const checkSubscriptionHandler = asyncHandler(
//     async (req: Request<ZodSchema.SubscriptionSchema.GetSubscriptionInput['params']>, res: Response) => {
//         try {
//             const result = await v1Services.checkSubscription(req.user.id, req.params.subscriptionId);

//             if (result.errMessage) {
//                 res.status(result.statusCode).json({
//                     success: false,
//                     message: result.errMessage
//                 });
//                 return;
//             }

//             res.status(result.statusCode).json({
//                 success: true,
//                 data: result.data
//             });
//         } catch (error) {
//             Logs.error("Check Subscription Handler Error:", error);
//             res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
//                 success: false,
//                 message: "Server Error! Please Try Again Later"
//             });
//         }
//     }
// );

// const pauseSubscriptionHandler = asyncHandler(
//     async (req: Request<ZodSchema.SubscriptionSchema.GetSubscriptionInput['params']>, res: Response) => {
//         try {
//             const result = await v1Services.pauseSubscription(req.user.id, req.params.subscriptionId);

//             if (result.errMessage) {
//                 res.status(result.statusCode).json({
//                     success: false,
//                     message: result.errMessage
//                 });
//                 return;
//             }

//             res.status(result.statusCode).json({
//                 success: true,
//                 message: result.message,
//                 data: result.data
//             });
//         } catch (error) {
//             Logs.error("Pause Subscription Handler Error:", error);
//             res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
//                 success: false,
//                 message: "Server Error! Please Try Again Later"
//             });
//         }
//     }
// );

// export const listSubscriptions = errorHandlerWrapper(listSubscriptionsHandler);
// export const createSubscription = errorHandlerWrapper(createSubscriptionHandler);
// export const getUserApiKeys = errorHandlerWrapper(getUserApiKeysHandler);
// export const getUserSubscriptions = errorHandlerWrapper(getUserSubscriptionsHandler);
// export const checkSubscription = errorHandlerWrapper(checkSubscriptionHandler);
// export const pauseSubscription = errorHandlerWrapper(pauseSubscriptionHandler);