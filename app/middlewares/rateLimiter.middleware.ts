import { ApiKeyModel, SubscriptionModel } from '@/models';
import { encryptApiKey } from '@/utils';

export const decrementQuota = async (req, res, next) => {
  try {
    const pagesLength = req.body.length || 1;

    const key_hash = encryptApiKey(req.apiKey.key_hash)
    const secret_hash = encryptApiKey(req.apiKey.seecret_hash)

    const foundSubscription = await SubscriptionModel.findOne({
      apiKey: key_hash,
      apiSecret: secret_hash
    }) as { _id: string } | null;

    if (!foundSubscription) return res.status(403).json({ error: 'Invalid API || Secret key' });

    const decrementedSubscriptionQouta = await SubscriptionModel.findByIdAndUpdate(
      foundSubscription?._id as string,
      [
        { 
          $inc: { remainingApiRequests: -pagesLength },
        },
        { 
          $inc: { usedApiRequests: +pagesLength }
        }
      ]
    )

    if (decrementedSubscriptionQouta) {
      await ApiKeyModel.findByIdAndUpdate(
        req.apiKey._id,
        { $inc: { requests_remaining: -pagesLength } }
      );
      next();
    }
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quota' });
  }
};