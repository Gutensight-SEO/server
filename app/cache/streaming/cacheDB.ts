/** @format */

import { Logs } from '../../monitoring';
import LFUCache from './inMemoryDB';

const cacheDB = new LFUCache();

// set cache
export const addStreamingRecord = async (id: string, data: any) => {
    try {
        const serializedData = JSON.stringify(data);
        await cacheDB.addRecord(id, serializedData);
        return;
    } catch (error) {
        Logs.error("Set Cache Error:", error);
        return;
    }
};

// get or set cache
export const getStreamingRecord = async (id: string) => {
    try {
        let data = await cacheDB.getRecord(id);

        if (data != null && data !== '') {
            const parsedData = JSON.parse(data);
            return {
                success: parsedData.success,
                status: parsedData.status,
                response: parsedData.result,  // Changed from 'data' to 'response' to match expected structure
                timestamp: parsedData.timestamp
            };
        } else if (data == null) {
            return null;
        }
    } catch (error) {
        Logs.error("Get Cache Error:", error);
        return null;
    }
};
