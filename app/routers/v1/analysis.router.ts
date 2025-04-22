/** @format */

import { Router, Request, Response } from 'express';
import { decrementQuota } from '@/middlewares';
import { analysisWorker } from '@/workers';
import { Logs } from '@/monitoring';
import { hashApiKey } from '@/utils';
import { ApiKeyModel } from '@/models';

const router = Router();
const ML_SERVER_URL = process.env.ML_SERVER_URL;

// Define custom request interface
export interface RequestWithApiKey extends Request {
  body: {
    apiKey: string;
    pages?: any[];
    page?: {
      content: {
        title: string;
        description: string;
        headers: any;
        keywords: string[];
        url: string;
        body: string;
        mobile_friendly: boolean;
        structured_data: any;
        status_codes: any;
      };
    };
  };
}

router.post(
  '/pages',
  decrementQuota,
  async (req: RequestWithApiKey, res: Response) => {
    try {
      const pages = req.body.pages;

      try {
        if (!req.body.apiKey) {
          res.status(401).json({ error: "Missing API Key" });
          return;
        }
        if (!pages || !Array.isArray(pages)) {
          res.status(400).json({ error: "Invalid request body" });
          return;
        }
        // console.log("Pages:", pages);

        const response: any = await analysisWorker(fetch(
          `${ML_SERVER_URL}/analyze/batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pages, number: new Date().getDate() })
          }
        ));

        // Add response validation
        if (!response.ok) {
          throw new Error(`ML service error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
        return;
      } catch (err) {
        Logs.error("Analysis generation error:", err);
        res.status(500).json({ error: 'Analysis failed' });
        return;
      }
    } catch (error) {
      Logs.error("Analysis error:", error);
      res.status(500).json({ error: "Server Error! Please Try Again" });
      return;
    }
  }
);

router.post(
  '/page',
  decrementQuota,
  async (req: RequestWithApiKey, res: Response) => {
    try {
      if (!req.body || !req.body.page) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }
      
      if (!req.body.apiKey) {
        res.status(401).json({ error: "Invalid API key" });
        return;
      }
        // console.log("Page:", req.body.page);
        
      // const { content: { title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes } } = req.body.page;

      try {
        const response: any = fetch(
          `${ML_SERVER_URL}/analyze/single`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: req.body.page, number: new Date().getDate() })
            // body: JSON.stringify({ title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes })
          }
        );

        const data = await response.json();
        res.json(data);

        return;
      } catch (err) {
        Logs.error("Analysis generation error:", err);
        res.status(500).json({ error: 'Analysis failed' });
        return;
      }
    } catch (error) {
      Logs.error("Analysis error:", error);
      res.status(500).json({ error: "Server Error! Please Try Again" });
      return;
    }
  }
);

router.post('/api-key', async (req: RequestWithApiKey, res: Response) => {
    try {
        const { apiKey } = req.body;
        // console.log("API Key:", apiKey);
        if (!apiKey) {
            // console.log("API NOT INCLUDED!")
            res.status(400).json({ error: "Missing API Key" });
            return;
        }

        const key_hash = hashApiKey(apiKey);
        
        const foundAPIKey = await ApiKeyModel.findOne({ key_hash });
        if (!foundAPIKey) {
            console.log("API NOT FOUND!")
            res.status(404).json({ error: "Invalid API Key" });
            return;
        }
        if (foundAPIKey.requests_remaining <= 0) {  
          console.log("API QOUTA EXCEEDED!")
            res.status(401).json({ error: "Quota Exceeded" });
            return;
        }
        res.status(200).json({ success: true, message: "API Key is valid" });
        return;
    } catch (error) {
        console.error("API Key validation error:", error);
        res.status(500).json({ error: "Server Error! Please Try Again" });
        return;
    }
})

export default router;


