"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
class LFUCache {
    constructor(maxSize = 10000) {
        this.records = new Map();
        this.maxSize = maxSize;
    }
    async addRecord(id, data) {
        const now = Date.now();
        // If cache is full, remove oldest entry
        if (this.records.size >= this.maxSize) {
            const oldestKey = this.records.keys().next().value;
            this.records.delete(oldestKey);
        }
        // Store data directly since it's already serialized
        await this.records.set(id, data);
    }
    async getRecord(id) {
        const record = await this.records.get(id);
        if (!record)
            return null;
        // Don't delete the record when getting it
        return record;
    }
}
exports.default = LFUCache;
