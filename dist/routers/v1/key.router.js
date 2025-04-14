"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const models_1 = require("@/models");
const utils_1 = require("@/utils");
const utils_2 = require("@/utils");
const monitoring_1 = require("@/monitoring");
const router = (0, express_1.Router)();
/**
 * POST /generate-key
 * Generates a new API key and secret for a user, hashes them, stores the hashed values,
 * and returns the raw keys to the user.
 */
router.post('/generate-key', async (req, res, next) => {
    const { userId, subscriptionType } = req.body;
    if (!userId || !subscriptionType) {
        res.status(400).json({ error: 'userId and subscriptionType are required' });
        return;
    }
    // Generate raw API key and secret
    const rawKey = crypto_1.default.randomBytes(16).toString('hex');
    const rawSecret = crypto_1.default.randomBytes(12).toString('hex');
    try {
        // Hash the keys using deterministic crypto-based hashing (SHA256)
        const hashedKey = await (0, utils_1.hashApiKey)(rawKey);
        const hashedSecret = await (0, utils_1.hashApiKey)(rawSecret);
        // Calculate maximum requests based on subscription type
        const maxRequests = (0, utils_2.CalculateMaxRequests)(subscriptionType);
        const newKey = await models_1.ApiKeyModel.create({
            key_hash: hashedKey,
            secret_hash: hashedSecret,
            requests_remaining: maxRequests,
            user_id: userId,
        });
        if (newKey) {
            res.status(201).json({ apiKey: rawKey, apiSecret: rawSecret });
            return;
        }
        else {
            monitoring_1.Logs.error("API KEY Error:", "Failed to create new API key document");
            res.status(500).json({ error: 'Key generation failed' });
            return;
        }
    }
    catch (err) {
        monitoring_1.Logs.error("API Keys generation error:", err);
        res.status(500).json({ error: 'Key generation failed' });
    }
});
/**
 * DELETE /delete-key
 * Deletes an API key given the raw key and secret.
 */
router.delete('/delete-key', async (req, res, next) => {
    const { apiKey, apiSecret } = req.body;
    if (!apiKey || !apiSecret) {
        res.status(400).json({ error: 'API key and secret key are required' });
        return;
    }
    try {
        const hashedKey = await (0, utils_1.hashApiKey)(apiKey);
        const hashedSecret = await (0, utils_1.hashApiKey)(apiSecret);
        const deletedKey = await models_1.ApiKeyModel.findOneAndDelete({
            key_hash: hashedKey,
            secret_hash: hashedSecret,
        });
        if (deletedKey) {
            res.status(200).json({ message: 'Key deleted successfully' });
            return;
        }
        else {
            res.status(404).json({ error: 'Key not found' });
            return;
        }
    }
    catch (err) {
        monitoring_1.Logs.error("API Keys deletion error:", err);
        res.status(500).json({ error: 'Key deletion failed' });
    }
});
/**
 * POST /update-quota
 * Updates the remaining request quota for a given API key.
 */
router.post('/update-quota', async (req, res, next) => {
    const { apiKey, apiSecret, newQuota } = req.body;
    if (!apiKey || !apiSecret || newQuota === undefined) {
        res.status(400).json({ error: 'API key, secret key, and newQuota are required' });
        return;
    }
    try {
        const hashedKey = await (0, utils_1.hashApiKey)(apiKey);
        const hashedSecret = await (0, utils_1.hashApiKey)(apiSecret);
        const updatedKey = await models_1.ApiKeyModel.findOneAndUpdate({ key_hash: hashedKey, secret_hash: hashedSecret }, { requests_remaining: newQuota }, { new: true });
        if (updatedKey) {
            res.status(200).json({ message: 'Quota updated successfully' });
            return;
        }
        else {
            res.status(404).json({ error: 'Key not found' });
            return;
        }
    }
    catch (err) {
        monitoring_1.Logs.error("API Keys update error:", err);
        res.status(500).json({ error: 'Quota update failed' });
    }
});
exports.default = router;
