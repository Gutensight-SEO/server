import { ApiKeyModel, SubscriptionModel } from '@/models';
import { RequestWithApiKey } from '@/routers/v1/analysis.router';
import { hashApiKey } from '@/utils';
import { Request, Response, NextFunction } from 'express';

// interface Subscription {
//   _id: string;
// }

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
    // console.log("API KEY:", requestWithApiKey.body.apiKey);
    if (!requestWithApiKey.body.apiKey) {
      res.status(401).json({ error: 'Missing API Key' });
      return;
    }

    const pagesLength: number = req.body.length || 1;

    const key_hash: string = hashApiKey(requestWithApiKey.body.apiKey);

    const foundSubscription = await SubscriptionModel.findOne({
      apiKeyHash: key_hash,
    }) 

    // console.log("FOUND SUBSCRIPTION:", foundSubscription)

    if (!foundSubscription) {
      // console.log("NO FOUND SUBSCRIPTION")
      res.status(401).json({ error: 'Invalid API key' });
      return;
    }

    if (foundSubscription.remainingApiRequests < pagesLength) {
      // console.log("QUOTA EXCEEDED")
      res.status(402).json({ error: 'Quota Exceeded' });
      return;
    }

    foundSubscription.remainingApiRequests -= pagesLength;
    foundSubscription.usedApiRequests += pagesLength;

    const decrementedSubscriptionQuota = await foundSubscription.save(); 

    if (decrementedSubscriptionQuota) {
      const foundApiKeyRecord = await ApiKeyModel.findOne(
        { key_hash },
      );
      if (foundApiKeyRecord) {
        foundApiKeyRecord.requests_remaining -= pagesLength;
        await foundApiKeyRecord.save();
      }
      
      next();
      return;
    } else {
      // console.log("400 ERR:", "no decrementedSubscriptionQuota")
      res.status(500).json({ error: 'error occured' });
      return;
    }
  } catch (err) {
    // console.log("500 ERR:", {err})
    res.status(500).json({ error: 'Failed to update quota' });
    return;
  }
};