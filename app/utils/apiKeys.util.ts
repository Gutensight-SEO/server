/** @format **/
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Environment variables (ensure these are set in your .env file)
const ENCRYPTION_KEY = process.env.API_ENCRYPTION_KEY!; // 32-byte hex string, e.g. "0123...af"
const HMAC_SECRET   = process.env.API_HMAC_SECRET!;   // arbitrary-length secret
const API_KEY_BYTES = 16; // Generates 32-character hex string

// Constants
const ALGORITHM    = 'aes-256-gcm';
const IV_LENGTH    = 12;                       // Recommended for GCM

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error('API_ENCRYPTION_KEY must be a 32-byte hex string (64 characters)');
}

const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

// Generate secure random API key
export const generateApiKey = (): string => {
  return crypto.randomBytes(API_KEY_BYTES).toString('hex');
};

/**
 * Encrypts plaintext with AES-256-GCM and returns a single string: iv:ciphertext:authTag
 */
export function encryptApiKey(rawKey: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(rawKey, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Format: iv:cipherText:tag, all in hex
  return [iv.toString('hex'), encrypted.toString('hex'), authTag.toString('hex')].join(':');
}

/**
 * Decrypts the combined string and returns the original plaintext
 */
export function decryptApiKey(combined: string): string {
  const [ivHex, encryptedHex, tagHex] = combined.split(':');
  if (!ivHex || !encryptedHex || !tagHex) {
    throw new Error('Invalid encrypted data format');
  }

  const iv        = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const authTag   = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString('utf8');
}

/**
 * Computes a deterministic HMAC-SHA256 of the raw key for lookup
 */
export function hashApiKey(rawKey: string): string {
  return crypto.createHmac('sha256', HMAC_SECRET)
               .update(rawKey)
               .digest('hex');
}

// Optionally, verify HMAC matches
export function verifyApiKeyHash(rawKey: string, expectedHash: string): boolean {
  const actual = hashApiKey(rawKey);
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expectedHash, 'hex'));
}