"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const authenticate = async (req, res, next) => {
    const apiKeyHeader = req.headers['x-api-key'];
    const secretKeyHeader = req.headers['x-api-secret'];
    if (!apiKeyHeader || !secretKeyHeader) {
        res.status(401).json({ error: 'API key and secret key required' });
        return;
    }
    try {
        const hashedKey = (0, utils_1.encryptApiKey)(apiKeyHeader);
        const hashedSecret = (0, utils_1.encryptApiKey)(secretKeyHeader);
        const apiKeyDoc = await models_1.ApiKeyModel.findOne({
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
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.authenticate = authenticate;
