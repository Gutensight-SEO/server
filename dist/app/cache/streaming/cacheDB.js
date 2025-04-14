"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamingRecord = exports.addStreamingRecord = void 0;
const monitoring_1 = require("../../monitoring");
const inMemoryDB_1 = __importDefault(require("./inMemoryDB"));
const cacheDB = new inMemoryDB_1.default();
// set cache
const addStreamingRecord = async (id, data) => {
    try {
        const serializedData = JSON.stringify(data);
        await cacheDB.addRecord(id, serializedData);
        return;
    }
    catch (error) {
        monitoring_1.Logs.error("Set Cache Error:", error);
        return;
    }
};
exports.addStreamingRecord = addStreamingRecord;
// get or set cache
const getStreamingRecord = async (id) => {
    try {
        let data = await cacheDB.getRecord(id);
        if (data != null && data !== '') {
            const parsedData = JSON.parse(data);
            return {
                success: parsedData.success,
                status: parsedData.status,
                response: parsedData.result, // Changed from 'data' to 'response' to match expected structure
                timestamp: parsedData.timestamp
            };
        }
        else if (data == null) {
            return null;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Get Cache Error:", error);
        return null;
    }
};
exports.getStreamingRecord = getStreamingRecord;
