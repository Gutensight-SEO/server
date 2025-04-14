"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptApiKey = exports.encryptApiKey = exports.generateApiKey = exports.hashApiKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Use crypto to derive a 32-byte key from the secret
const deriveKey = (secret) => {
    return crypto_1.default.pbkdf2Sync(secret, // || 'default-secret-key',  // Fallback if env var not set
    'salt', // Constant salt for key derivation
    100000, // Number of iterations
    32, // Key length in bytes
    'sha256' // Hash algorithm
    );
};
const ENCRYPTION_KEY = deriveKey(process.env.API_KEYS_SECRET);
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
// Hash API key for storage and comparison
const hashApiKey = (key) => {
    return crypto_1.default.createHash('sha256').update(key).digest('hex');
};
exports.hashApiKey = hashApiKey;
// Generate secure random API key
const generateApiKey = (length = 32) => {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateApiKey = generateApiKey;
// Encrypt API key/secret before storing
const encryptApiKey = (text) => {
    try {
        const salt = crypto_1.default.randomBytes(SALT_LENGTH);
        const iv = crypto_1.default.randomBytes(IV_LENGTH);
        const cipher = crypto_1.default.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }
    catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt API key');
    }
};
exports.encryptApiKey = encryptApiKey;
// Decrypt API key/secret for sending to client
const decryptApiKey = (encryptedText) => {
    try {
        if (!encryptedText) {
            return;
        }
        // Handle non-encrypted keys (legacy format)
        if (!encryptedText.includes(':')) {
            return;
        }
        const [salt, iv, authTag, encryptedData] = encryptedText.split(':');
        if (!salt || !iv || !authTag || !encryptedData) {
            return; // Return if not in correct format
        }
        const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        console.error('Decryption error:', error);
        return; // Return if decryption fails
    }
};
exports.decryptApiKey = decryptApiKey;
