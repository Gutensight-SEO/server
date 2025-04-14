"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.updateCache = exports.getOrSetCache = exports.getCache = exports.setCache = void 0;
const readCache_1 = require("./readCache");
const EXPIRES_IN = 6000 * 5;
// set cache
const setCache = async (key, data) => {
    return readCache_1.readCache.set(key, data, EXPIRES_IN);
};
exports.setCache = setCache;
// get cache
const getCache = async (key) => {
    return readCache_1.readCache.get(key);
};
exports.getCache = getCache;
// get or set cache
const getOrSetCache = async (key, cb) => {
    try {
        let data = await readCache_1.readCache.get(key);
        if (data != null)
            return data;
        data = await Promise.resolve(cb());
        if (data !== null) {
            await readCache_1.readCache.set(key, data, EXPIRES_IN);
            return data;
        }
        return false;
    }
    catch (error) {
        return false;
    }
};
exports.getOrSetCache = getOrSetCache;
// update cache key value
const updateCache = async (key, data) => {
    return readCache_1.readCache.update(key, data);
};
exports.updateCache = updateCache;
// delete cache key value
const deleteCache = async (key) => {
    return readCache_1.readCache.delete(key);
};
exports.deleteCache = deleteCache;
