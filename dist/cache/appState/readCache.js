"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCache = void 0;
const monitoring_1 = require("../../monitoring");
class ReadCache {
    constructor() {
        this.defaultExpiry = 300000; // 5 minutes
        this.cache = new Map();
    }
    static getInstance() {
        if (!ReadCache.instance) {
            ReadCache.instance = new ReadCache();
        }
        return ReadCache.instance;
    }
    async set(key, data, expiresIn) {
        try {
            const expiry = Date.now() + (expiresIn || this.defaultExpiry);
            this.cache.set(key, { data, expiry });
            return true;
        }
        catch (error) {
            monitoring_1.Logs.error("ReadCache Set Error:", error);
            return false;
        }
    }
    async get(key) {
        try {
            const item = this.cache.get(key);
            if (!item)
                return null;
            if (Date.now() > item.expiry) {
                this.cache.delete(key);
                return null;
            }
            return item.data;
        }
        catch (error) {
            monitoring_1.Logs.error("ReadCache Get Error:", error);
            return null;
        }
    }
    async delete(key) {
        try {
            return this.cache.delete(key);
        }
        catch (error) {
            monitoring_1.Logs.error("ReadCache Delete Error:", error);
            return false;
        }
    }
    async update(key, data) {
        const item = this.cache.get(key);
        if (!item)
            return false;
        return this.set(key, data, item.expiry - Date.now());
    }
}
exports.readCache = ReadCache.getInstance();
