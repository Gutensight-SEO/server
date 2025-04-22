/** @format */

import { Router, Request, Response } from 'express';
import { decrementQuota } from '@/middlewares';
import { Logs } from '@/monitoring';
import { hashApiKey } from '@/utils';
import { ApiKeyModel } from '@/models';

const router = Router();
const ML_SERVER_URL = process.env.ML_SERVER_URL;

// Extend Express Request to include apiKey and page(s) payload
export interface RequestWithApiKey extends Request {
  body: {
    apiKey: string;
    pages?: Array<any>;
    page?: any;
  };
}

// Helper: validate API key presence and format
function validateApiKey(req: RequestWithApiKey, res: Response): boolean {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string') {
    res.status(401).json({ error: 'Missing or invalid API Key' });
    return false;
  }
  return true;
}

// Helper: validate ML server URL
function ensureMLServer(res: Response): boolean {
  if (!ML_SERVER_URL) {
    Logs.error("Analysis error:", 'Missing ML_SERVER_URL environment variable');
    res.status(500).json({ error: 'Server misconfiguration' });
    return false;
  }
  return true;
}

// POST /pages - batch analysis
router.post(
  '/pages',
  decrementQuota,
  async (req: RequestWithApiKey, res: Response) => {
    try {
      if (!validateApiKey(req, res)) return;
      if (!ensureMLServer(res)) return;

      const { pages } = req.body;
      if (!Array.isArray(pages) || pages.length === 0) {
        res.status(400).json({ error: 'Invalid request body: pages must be a non-empty array' });
        return;
      }

      const payload = { pages, number: new Date().getDate() };
      let response;
      try {
        response = await fetch(
          `${ML_SERVER_URL}/analyze/batch`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      } catch (fetchErr) {
        Logs.error('Failed to fetch from ML server:', fetchErr);
        res.status(502).json({ error: 'Failed to reach ML service' });
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        Logs.error(`ML service returned status ${response.status}:`, data);
        res.status(502).json({ error: 'ML service error', details: data });
        return;
      }

      res.status(200).json(data);
    } catch (err) {
      Logs.error('Analysis /pages error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /page - single analysis
router.post(
  '/page',
  decrementQuota,
  async (req: RequestWithApiKey, res: Response) => {
    try {
      if (!validateApiKey(req, res)) return;
      if (!ensureMLServer(res)) return;

      const { page } = req.body;
      if (!page || typeof page !== 'object') {
        res.status(400).json({ error: 'Invalid request body: page is required' });
        return;
      }

      const payload = { content: page, number: new Date().getDate() };
      let response;
      try {
        response = await fetch(
          `${ML_SERVER_URL}/analyze/single`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      } catch (fetchErr) {
        Logs.error('Failed to fetch from ML server:', fetchErr);
        res.status(502).json({ error: 'Failed to reach ML service' });
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        Logs.error(`ML service returned status ${response.status}:`, data);
        res.status(502).json({ error: 'ML service error', details: data });
        return;
      }

      console.log("DATA:", {data})
      res.status(200).json(data);
    } catch (err) {
      Logs.error('Analysis /page error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /api-key - validate API key and quota remaining
router.post('/api-key', async (req: RequestWithApiKey, res: Response) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== 'string') {
      res.status(400).json({ error: 'Missing API Key' });
      return;
    }

    const key_hash = hashApiKey(apiKey);
    const found = await ApiKeyModel.findOne({ key_hash });
    if (!found) {
      res.status(404).json({ error: 'Invalid API Key' });
      return;
    }
    if (found.requests_remaining <= 0) {
      res.status(403).json({ error: 'Quota exceeded' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    Logs.error('API Key validation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
