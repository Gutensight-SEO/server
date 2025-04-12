import { Logs } from '../../monitoring';

class ReadCache {
    private static instance: ReadCache;
    private cache: Map<string, { data: any; expiry: number }>;
    private readonly defaultExpiry: number = 300000; // 5 minutes

    private constructor() {
        this.cache = new Map();
    }

    static getInstance(): ReadCache {
        if (!ReadCache.instance) {
            ReadCache.instance = new ReadCache();
        }
        return ReadCache.instance;
    }

    async set(key: string, data: any, expiresIn?: number): Promise<boolean> {
        try {
            const expiry = Date.now() + (expiresIn || this.defaultExpiry);
            this.cache.set(key, { data, expiry });
            return true;
        } catch (error) {
            Logs.error("ReadCache Set Error:", error);
            return false;
        }
    }

    async get(key: string): Promise<any> {
        try {
            const item = this.cache.get(key);
            if (!item) return null;
            
            if (Date.now() > item.expiry) {
                this.cache.delete(key);
                return null;
            }
            
            return item.data;
        } catch (error) {
            Logs.error("ReadCache Get Error:", error);
            return null;
        }
    }

    async delete(key: string): Promise<boolean> {
        try {
            return this.cache.delete(key);
        } catch (error) {
            Logs.error("ReadCache Delete Error:", error);
            return false;
        }
    }

    async update(key: string, data: any): Promise<any> {
        const item = this.cache.get(key);
        if (!item) return false;
        
        return this.set(key, data, item.expiry - Date.now());
    }
}

export const readCache = ReadCache.getInstance();
