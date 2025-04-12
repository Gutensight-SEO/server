import { Request, Response } from 'express';
import axios from 'axios';
import { Subscription } from '../models/subscription.model';
import { UserSubscription } from '../models/userSubscription.model';
import { SubscriptionController } from './subscription.controller';
import { STATUS_CODES } from '@/constants';
import { Logs } from '@/monitoring';
import crypto from 'crypto';

export class PaymentController {
  static async verifyPaystack(req: Request, res: Response) {
    try {
      const { reference, planId } = req.body;
      
      // Verify payment with Paystack
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { 
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        }
      );

      if (response.data.status) {
        const subscription = await Subscription.findById(planId);
        if (!subscription) {
          return res.status(404).json({ message: 'Subscription not found' });
        }

        // Create user subscription
        const result = await SubscriptionController.createUserSubscription({
          ...req,
          body: {
            subscriptionId: planId,
            paymentType: 'paystack'
          }
        } as Request, res);

        return result;
      }

      res.status(400).json({ message: 'Payment verification failed' });
    } catch (error) {
      res.status(500).json({ message: 'Payment verification failed' });
    }
  }

  static async submitCryptoTransaction(req: Request, res: Response) {
    try {
      const { transactionHash, planId } = req.body;
      
      // Create pending subscription
      const subscription = await UserSubscription.create({
        userId: req.user.id,
        subscriptionId: planId,
        paymentType: 'crypto',
        paymentStatus: 'pending',
        transactionHash
      });

      // Send notification to admin (implement your notification system here)
      
      res.status(200).json({ 
        message: 'Transaction submitted successfully',
        subscriptionId: subscription._id
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit transaction' });
    }
  }
}

export const verifyPaystackPayment = async (payload: {
  reference: string;
  planId: string;
  userId: string;
}) => {
  try {
    const { reference, planId, userId } = payload;
    
    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { 
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    if (!response.data.status) {
      return {
        statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
        errMessage: 'Payment verification failed'
      };
    }

    const subscription = await Subscription.findById(planId);
    if (!subscription) {
      return {
        statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
        errMessage: 'Subscription not found'
      };
    }

    // Generate API credentials
    const apiKey = crypto.randomBytes(16).toString('hex');
    const apiSecret = crypto.randomBytes(32).toString('hex');

    // Create user subscription
    const userSubscription = await UserSubscription.create({
      userId,
      subscriptionId: planId,
      apiKey,
      apiSecret,
      startDate: new Date(),
      endDate: new Date(Date.now() + subscription.durationDays * 24 * 60 * 60 * 1000),
      totalRequests: subscription.apiRequestQuota,
      paymentType: 'paystack',
      paymentStatus: 'completed',
      paystackReference: reference
    });

    return {
      statusCode: STATUS_CODES.SUCCESS.OK,
      message: 'Payment verified successfully',
      data: userSubscription
    };
  } catch (error) {
    Logs.error('Verify Paystack Payment Error:', error);
    return {
      statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
      errMessage: 'Payment verification failed'
    };
  }
};

export const processCryptoPayment = async (payload: {
  transactionHash: string;
  planId: string;
  userId: string;
}) => {
  try {
    const { transactionHash, planId, userId } = payload;
    
    const subscription = await Subscription.findById(planId);
    if (!subscription) {
      return {
        statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
        errMessage: 'Subscription not found'
      };
    }

    // Generate API credentials
    const apiKey = crypto.randomBytes(16).toString('hex');
    const apiSecret = crypto.randomBytes(32).toString('hex');
    
    // Create pending subscription
    const userSubscription = await UserSubscription.create({
      userId,
      subscriptionId: planId,
      apiKey,
      apiSecret,
      startDate: new Date(),
      endDate: new Date(Date.now() + subscription.durationDays * 24 * 60 * 60 * 1000),
      totalRequests: subscription.apiRequestQuota,
      paymentType: 'crypto',
      paymentStatus: 'pending',
      transactionHash
    });

    return {
      statusCode: STATUS_CODES.SUCCESS.OK,
      message: 'Crypto transaction submitted successfully',
      data: {
        subscriptionId: userSubscription._id,
        status: 'pending'
      }
    };
  } catch (error) {
    Logs.error('Process Crypto Payment Error:', error);
    return {
      statusCode: STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
      errMessage: 'Failed to submit transaction'
    };
  }
};