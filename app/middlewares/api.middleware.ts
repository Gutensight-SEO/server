import { ApiKeyModel } from '@/models';
import { encryptApiKey } from '@/utils';
// import { validateApiKey } from '../utils/auth.js';

export const authenticate = async (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'];
  const secretKeyHeader = req.headers['x-api-secret'];
  if (!apiKeyHeader || !secretKeyHeader) {
    return res.status(401).json({ error: 'API key and secret key required' });
  }

  try {
    const hashedKey = encryptApiKey(apiKeyHeader);
    const hashedSecret = encryptApiKey(secretKeyHeader);

    const apiKeyDoc = await ApiKeyModel.findOne({ 
        key_hash: hashedKey,
        secret_hash: hashedSecret
     });
    if (!apiKeyDoc) {
      return res.status(403).json({ error: 'Invalid API || Secret key' });
    }

    if (apiKeyDoc.requests_remaining <= 0) {
      return res.status(429).json({ error: 'Quota exceeded' });
    }

    req.apiKey = apiKeyDoc;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};