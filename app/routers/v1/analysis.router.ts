// /** @format */

// import { Router, Request, Response } from 'express';
// import { authenticate, decrementQuota } from '@/middlewares';
// import { analysisWorker } from '@/workers';
// import { Logs } from '@/monitoring';

// const router = Router();
// const ML_SERVER_URL = process.env.ML_SERVER_URL;

// // Define custom request interface
// interface RequestWithApiKey extends Request {
//   body: {
//     pages?: any[];
//     page?: {
//       content: {
//         title: string;
//         description: string;
//         headers: any;
//         keywords: string[];
//         url: string;
//         body: string;
//         mobile_friendly: boolean;
//         structured_data: any;
//         status_codes: any;
//       };
//     };
//   };
// }

// router.post(
//   '/batch',
//   authenticate,
//   decrementQuota,
//   async (req: RequestWithApiKey, res: Response) => {
//     try {
//       const pages = req.body.pages;

//       try {
//         const response = await analysisWorker(fetch(
//           `${ML_SERVER_URL}/analyze/batch`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               // ...(req.header('x-api-key') && { 'x-api-key': req.header('x-api-key') }),
//             },
//             body: JSON.stringify({ pages })
//           }
//         ));

//         res.json((response as { data: any }).data);
//         return;
//       } catch (err) {
//         Logs.error("Analysis generation error:", err);
//         res.status(400).json({ error: 'Analysis failed' });
//         return;
//       }
//     } catch (error) {
//       Logs.error("Analysis error:", error);
//       res.status(500).json({ error: "Server Error! Please Try Again" });
//       return;
//     }
//   }
// );

// router.post(
//   '/',
//   authenticate,
//   decrementQuota,
//   async (req: RequestWithApiKey, res: Response) => {
//     try {
//       if (!req.body || !req.body.page) {
//         res.status(400).json({ error: "Invalid request body" });
//       }
//       const { content: { title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes } } = req.body.page;

//       try {
//         if (!req.header('x-api-key')) {
//           res.status(400).json({ error: "Missing API Key" });
//           return;
//         }

//         const response = await analysisWorker(fetch(
//           `${ML_SERVER_URL}/analyze`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               // ...(req.header('x-api-key') && { 'x-api-key': req.header('x-api-key') }),
//             },
//             body: JSON.stringify({ title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes })
//           }
//         ));

//         res.json((response as { data: any }).data);
//         return;
//       } catch (err) {
//         Logs.error("Analysis generation error:", err);
//         res.status(400).json({ error: 'Analysis failed' });
//         return;
//       }
//     } catch (error) {
//       Logs.error("Analysis error:", error);
//       res.status(500).json({ error: "Server Error! Please Try Again" });
//       return;
//     }
//   }
// );

// export default router;


