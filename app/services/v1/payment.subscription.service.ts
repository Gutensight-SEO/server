// import { Request, Response } from 'express';
// import axios from 'axios';
// import { Subscription } from '../models/subscription.model';
// import { UserSubscription } from '../models/userSubscription.model';
// import { SubscriptionController } from './subscription.controller';
// import { STATUS_CODES } from '@/constants';
// import { Logs } from '@/monitoring';

// export const verifyPaystack = async (referenceId: string, planId: string) => {
//     try {
//         const response = await axios.get(
//             `https://api.paystack.co/transaction/verify/${referenceId}`,
//             {
//                 headers: { 
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
//                 }
//             }
//         );

//         if (!response.data.status) {
//             return {
//                 statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
//                 errMessage: 'Payment verification failed'
//             };
//         }

//         return {
//             statusCode: STATUS_CODES.SUCCESS.OK,
//             message: 'Payment verified successfully',
//             data: response.data
//         };

//     } catch (error) {
//         Logs.error('Verify Paystack Error:', error);
//         return {
//             statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
//             errMessage: 'Payment verification failed'
//         };
//     }
// };

// export const submitCryptoTransaction = async (payload: {
//     transactionHash: string;
//     planId: string;
//     userId: string;
// }) => {
//     try {
//         const { transactionHash, planId, userId } = payload;
        
//         // Create submission record
//         return {
//             statusCode: STATUS_CODES.SUCCESS.OK,
//             message: 'Crypto transaction submitted successfully',
//             data: {
//                 transactionHash,
//                 planId,
//                 userId,
//                 status: 'pending'
//             }
//         };
//     } catch (error) {
//         Logs.error('Submit Crypto Transaction Error:', error);
//         return {
//             statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
//             errMessage: 'Failed to submit transaction'
//         };
//     }
// };

// export const verifyPaystackPayment = async (payload: {
//     reference: string;
//     planId: string;
//     userId: string;
// }) => {
//     try {
//         const { reference, planId } = payload;
        
//         const verification = await verifyPaystack(reference, planId);
//         return verification;

//     } catch (error) {
//         Logs.error('Verify Paystack Payment Error:', error);
//         return {
//             statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
//             errMessage: 'Payment verification failed'
//         };
//     }
// };

// export const processCryptoPayment = async (payload: {
//   transactionHash: string;
//   planId: string;
//   userId: string;
// }) => {
//   try {
//     const { transactionHash, planId, userId } = payload;
    
//     // Create pending subscription
//     const subscription = await UserSubscription.create({
//       userId,
//       subscriptionId: planId,
//       paymentType: 'crypto',
//       paymentStatus: 'pending',
//       transactionHash
//       // ...other subscription details
//     });

//     return {
//       statusCode: STATUS_CODES.SUCCESS.OK,
//       message: 'Crypto transaction submitted successfully',
//       data: {
//         subscriptionId: subscription._id,
//         status: 'pending'
//       }
//     };
//   } catch (error) {
//     Logs.error('Process Crypto Payment Error:', error);
//     return {
//       statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
//       errMessage: 'Failed to submit transaction'
//     };
//   }
// };