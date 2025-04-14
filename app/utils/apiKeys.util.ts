/** @format */

import crypto from 'crypto';

// Use crypto to derive a 32-byte key from the secret
const deriveKey = (secret: string): Buffer => {
  return crypto.pbkdf2Sync(
    secret, // || 'default-secret-key',  // Fallback if env var not set
    'salt',  // Constant salt for key derivation
    100000,  // Number of iterations
    32,      // Key length in bytes
    'sha256' // Hash algorithm
  );
};

const ENCRYPTION_KEY = deriveKey(process.env.API_KEYS_SECRET!);
const IV_LENGTH = 16;
const SALT_LENGTH = 64;

// Hash API key for storage and comparison
export const hashApiKey = (key: string): string => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

// Generate secure random API key
export const generateApiKey = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Encrypt API key/secret before storing
export const encryptApiKey = (text: string): string => {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt API key');
  }
};

// Decrypt API key/secret for sending to client
export const decryptApiKey = (encryptedText: string | undefined | null): string | undefined => {
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
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      ENCRYPTION_KEY,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return; // Return if decryption fails
  }
};

