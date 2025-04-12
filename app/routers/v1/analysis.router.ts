/** @format */

import { Router } from 'express';
// import axios from 'axios';
import { authenticate, decrementQuota } from '@/middlewares';
import { analysisWorker } from '@/workers';
import { Logs } from '@/monitoring';

const router = Router();
const ML_SERVER_URL = process.env.ML_SERVER_URL;

router.post(
  '/batch',
  authenticate,
  decrementQuota,
  async (req, res) => {
    try {
      const pages = req.body.pages;
    
      try {
        const response = await analysisWorker(fetch(
          `${ML_SERVER_URL}/analyze/batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': req.headers['x-api-key'],
              'x-api-secret': req.headers['x-api-secret'],
            },
            body: JSON.stringify({ pages })
          }
        ));

        res.json((response as { data: any }).data);
      } catch (err) {
        Logs.error("Analysis generation error:", err);
        res.status(400).json({ error: 'Analysis failed' });
      }
    } catch (error) {
      Logs.error("Analysis error:", error);
      res.status(500).json({ error: "Server Error! Please Try Again" });
    }
  }
);

router.post(
  '/',
  authenticate,
  decrementQuota,
  async (req, res) => {
    try {
      const { content: { title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes } } = req.body.page;
    
      try {
        const response = await analysisWorker(fetch(
          `${ML_SERVER_URL}/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': req.headers['x-api-key'],
              'x-api-secret': req.headers['x-api-secret'],
            },
            body: JSON.stringify({ title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes })
          }
        ));

        res.json((response as { data: any }).data);
      } catch (err) {
        Logs.error("Analysis generation error:", err);
        res.status(400).json({ error: 'Analysis failed' });
      }
    } catch (error) {
      Logs.error("Analysis error:", error);
      res.status(500).json({ error: "Server Error! Please Try Again" });
    }
  }
);

export default router;


