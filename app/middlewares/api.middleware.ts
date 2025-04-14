import { ApiKeyModel } from '@/models';
import { encryptApiKey } from '@/utils';
import { Request, Response, NextFunction } from 'express';
// import { validateApiKey } from '../utils/auth.js';

interface ApiKeyRequest extends Request {
  apiKey?: {
    key_hash: string;
    secret_hash: string;
    requests_remaining: number;
  };
}

export const authenticate = async (
  req: ApiKeyRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKeyHeader: string | undefined = req.headers['x-api-key'] as string | undefined;
  const secretKeyHeader: string | undefined = req.headers['x-api-secret'] as string | undefined;
  if (!apiKeyHeader || !secretKeyHeader) {
    res.status(401).json({ error: 'API key and secret key required' });
    return;
  }

  try {
    const hashedKey: string = encryptApiKey(apiKeyHeader);
    const hashedSecret: string = encryptApiKey(secretKeyHeader);

    const apiKeyDoc = await ApiKeyModel.findOne({ 
        key_hash: hashedKey,
        secret_hash: hashedSecret
     });
    if (!apiKeyDoc) {
      res.status(403).json({ error: 'Invalid API || Secret key' });
      return;
    }

    if (apiKeyDoc.requests_remaining <= 0) {
      res.status(429).json({ error: 'Quota exceeded' });
      return;
    }

    req.apiKey = apiKeyDoc;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};