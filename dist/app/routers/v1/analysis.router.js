"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const workers_1 = require("../../workers");
const monitoring_1 = require("../../monitoring");
const router = (0, express_1.Router)();
const ML_SERVER_URL = process.env.ML_SERVER_URL;
// // Define custom request interface
// interface RequestWithApiKey extends Request {
//   apiKey: string;
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
router.post('/batch', middlewares_1.authenticate, middlewares_1.decrementQuota, async (req, res) => {
    try {
        const pages = req.body.pages;
        try {
            const response = await (0, workers_1.analysisWorker)(fetch(`${ML_SERVER_URL}/analyze/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // ...(req.header('x-api-key') && { 'x-api-key': req.header('x-api-key') }),
                },
                body: JSON.stringify({ pages })
            }));
            res.json(response.data);
            return;
        }
        catch (err) {
            monitoring_1.Logs.error("Analysis generation error:", err);
            res.status(400).json({ error: 'Analysis failed' });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Analysis error:", error);
        res.status(500).json({ error: "Server Error! Please Try Again" });
        return;
    }
});
router.post('/', middlewares_1.authenticate, middlewares_1.decrementQuota, async (req, res) => {
    try {
        if (!req.body || !req.body.page) {
            res.status(400).json({ error: "Invalid request body" });
        }
        const { content: { title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes } } = req.body.page;
        try {
            if (!req.header('x-api-key')) {
                res.status(400).json({ error: "Missing API Key" });
                return;
            }
            const response = await (0, workers_1.analysisWorker)(fetch(`${ML_SERVER_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // ...(req.header('x-api-key') && { 'x-api-key': req.header('x-api-key') }),
                },
                body: JSON.stringify({ title, description, headers, keywords, url, body, mobile_friendly, structured_data, status_codes })
            }));
            res.json(response.data);
            return;
        }
        catch (err) {
            monitoring_1.Logs.error("Analysis generation error:", err);
            res.status(400).json({ error: 'Analysis failed' });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Analysis error:", error);
        res.status(500).json({ error: "Server Error! Please Try Again" });
        return;
    }
});
exports.default = router;
