/** @format */

class LFUCache {
    records: Map<any, any>;
    maxSize: number;

    constructor(maxSize: number = 10000) {
        this.records = new Map();
        this.maxSize = maxSize;
    }

    async addRecord(id: string, data: string) {
        const now = Date.now();

        // If cache is full, remove oldest entry
        if (this.records.size >= this.maxSize) {
            const oldestKey = this.records.keys().next().value;
            this.records.delete(oldestKey);
        }

        // Store data directly since it's already serialized
        await this.records.set(id, data);
    }

    async getRecord(id: string) {        
        const record = await this.records.get(id);
        if (!record) return null;
        
        // Don't delete the record when getting it
        return record;
    }
}

export default LFUCache;