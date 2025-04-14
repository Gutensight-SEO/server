"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrementQuota = void 0;
const models_1 = require("@/models");
const utils_1 = require("@/utils");
/**
 * Middleware to decrement the quota for the API key.
 * It checks if the API key is valid and decrements the remaining requests.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - Returns a response or calls next().
 */
const decrementQuota = async (req, res, next) => {
    try {
        const requestWithApiKey = req;
        const pagesLength = req.body.length || 1;
        const key_hash = (0, utils_1.encryptApiKey)(requestWithApiKey.apiKey);
        const foundSubscription = await models_1.SubscriptionModel.findOne({
            apiKey: key_hash,
        });
        if (!foundSubscription) {
            res.status(403).json({ error: 'Invalid API' });
            return;
        }
        const decrementedSubscriptionQouta = await models_1.SubscriptionModel.findByIdAndUpdate(foundSubscription._id, [
            {
                $inc: { remainingApiRequests: -pagesLength },
            },
            {
                $inc: { usedApiRequests: +pagesLength }
            }
        ]);
        if (decrementedSubscriptionQouta) {
            const foundApiKeyRecord = await models_1.ApiKeyModel.findOne({ apiKey: requestWithApiKey.apiKey });
            if (foundApiKeyRecord) {
                foundApiKeyRecord.requests_remaining -= pagesLength;
                await foundApiKeyRecord.save();
            }
            next();
            return;
        }
        else {
            res.status(400).json({ error: 'error occured' });
            return;
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update quota' });
        return;
    }
};
exports.decrementQuota = decrementQuota;
