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

export const decrementQuota = async (req: RequestWithApiKey, res: Response, next: NextFunction) => {
  try {
    const pagesLength: number = req.body.length || 1;

    const key_hash: string = encryptApiKey(req.apiKey);

    const foundSubscription = await SubscriptionModel.findOne({
      apiKey: key_hash,
    }) as Subscription | null;

    if (!foundSubscription) return res.status(403).json({ error: 'Invalid API' });

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
      await ApiKeyModel.findOne(
        { apiKey: req.apiKey },
        { $inc: { requests_remaining: -pagesLength } }
      );
      next();
    }
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quota' });
  }
};