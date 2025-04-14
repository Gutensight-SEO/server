import { ApiKeyModel, SubscriptionModel } from '@/models';
import { encryptApiKey } from '@/utils';
import { Request, Response, NextFunction } from 'express';

interface Subscription {
  _id: string;
}

// Define custom request interface
interface RequestWithApiKey extends Request {
  apiKey: string;
}

/**
 * Middleware to decrement the quota for the API key.
 * It checks if the API key is valid and decrements the remaining requests.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - Returns a response or calls next().
 */
export const decrementQuota = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestWithApiKey = req as RequestWithApiKey;

    const pagesLength: number = req.body.length || 1;

    const key_hash: string = encryptApiKey(requestWithApiKey.apiKey);

    const foundSubscription = await SubscriptionModel.findOne({
      apiKey: key_hash,
    }) as Subscription | null;

    if (!foundSubscription) {
      res.status(403).json({ error: 'Invalid API' });
      return;
    }

    const decrementedSubscriptionQouta = await SubscriptionModel.findByIdAndUpdate(
      foundSubscription._id,
      [
        { 
          $inc: { remainingApiRequests: -pagesLength },
        },
        { 
          $inc: { usedApiRequests: +pagesLength }
        }
      ]
    );

    if (decrementedSubscriptionQouta) {
      const foundApiKeyRecord = await ApiKeyModel.findOne(
        { apiKey: requestWithApiKey.apiKey },
      );
      if (foundApiKeyRecord) {
        foundApiKeyRecord.requests_remaining -= pagesLength;
        await foundApiKeyRecord.save();
      }
      
      next();
      return;
    } else {
      res.status(400).json({ error: 'error occured' });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quota' });
    return;
  }
};