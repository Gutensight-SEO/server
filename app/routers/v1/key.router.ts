// /** @format */

// import { Router, Request, Response, NextFunction } from 'express';
// import crypto from 'crypto';
// import { ApiKeyModel } from '@/models';
// import { hashApiKey } from '@/utils';
// import { CalculateMaxRequests } from '@/utils';
// import { Logs } from '@/monitoring';

// const router = Router();

// /**
//  * POST /generate-key
//  * Generates a new API key and secret for a user, hashes them, stores the hashed values,
//  * and returns the raw keys to the user.
//  */
// router.post('/generate-key', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { userId, subscriptionType } = req.body;

//   if (!userId || !subscriptionType) {
//     res.status(400).json({ error: 'userId and subscriptionType are required' });
//     return;
//   }

//   // Generate raw API key and secret
//   const rawKey = crypto.randomBytes(16).toString('hex');
//   const rawSecret = crypto.randomBytes(12).toString('hex');

//   try {
//     // Hash the keys using deterministic crypto-based hashing (SHA256)
//     const hashedKey = await hashApiKey(rawKey);
//     const hashedSecret = await hashApiKey(rawSecret);

//     // Calculate maximum requests based on subscription type
//     const maxRequests = CalculateMaxRequests(subscriptionType);

//     const newKey = await ApiKeyModel.create({
//       key_hash: hashedKey,
//       secret_hash: hashedSecret,
//       requests_remaining: maxRequests,
//       user_id: userId,
//     });

//     if (newKey) {
//       res.status(201).json({ apiKey: rawKey, apiSecret: rawSecret });
//       return;
//     } else {
//       Logs.error("API KEY Error:", "Failed to create new API key document");
//       res.status(500).json({ error: 'Key generation failed' });
//       return;
//     }
//   } catch (err) {
//     Logs.error("API Keys generation error:", err);
//     res.status(500).json({ error: 'Key generation failed' });
//   }
// });

// /**
//  * DELETE /delete-key
//  * Deletes an API key given the raw key and secret.
//  */
// router.delete('/delete-key', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { apiKey, apiSecret } = req.body;

//   if (!apiKey || !apiSecret) {
//     res.status(400).json({ error: 'API key and secret key are required' });
//     return;
//   }

//   try {
//     const hashedKey = await hashApiKey(apiKey);
//     const hashedSecret = await hashApiKey(apiSecret);

//     const deletedKey = await ApiKeyModel.findOneAndDelete({
//       key_hash: hashedKey,
//       secret_hash: hashedSecret,
//     });

//     if (deletedKey) {
//       res.status(200).json({ message: 'Key deleted successfully' });
//       return;
//     } else {
//       res.status(404).json({ error: 'Key not found' });
//       return;
//     }
//   } catch (err) {
//     Logs.error("API Keys deletion error:", err);
//     res.status(500).json({ error: 'Key deletion failed' });
//   }
// });

// /**
//  * POST /update-quota
//  * Updates the remaining request quota for a given API key.
//  */
// router.post('/update-quota', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { apiKey, apiSecret, newQuota } = req.body;

//   if (!apiKey || !apiSecret || newQuota === undefined) {
//     res.status(400).json({ error: 'API key, secret key, and newQuota are required' });
//     return;
//   }

//   try {
//     const hashedKey = await hashApiKey(apiKey);
//     const hashedSecret = await hashApiKey(apiSecret);

//     const updatedKey = await ApiKeyModel.findOneAndUpdate(
//       { key_hash: hashedKey, secret_hash: hashedSecret },
//       { requests_remaining: newQuota },
//       { new: true }
//     );

//     if (updatedKey) {
//       res.status(200).json({ message: 'Quota updated successfully' });
//       return;
//     } else {
//       res.status(404).json({ error: 'Key not found' });
//       return;
//     }
//   } catch (err) {
//     Logs.error("API Keys update error:", err);
//     res.status(500).json({ error: 'Quota update failed' });
//   }
// });

// export default router;
