/** @format */

import { Logs } from "@/monitoring";
import { readCache } from "./readCache";

const EXPIRES_IN = 6000 * 5;

// set cache
export const setCache = async (key: string, data: any) => {
    return readCache.set(key, data, EXPIRES_IN);
}

// get cache
export const getCache = async (key: string) => {
    return readCache.get(key);
}

// get or set cache
export const getOrSetCache = async (key: string, cb: () => Promise<any>) => {
    try {
        let data = await readCache.get(key);
        if (data != null) return data;

        data = await Promise.resolve(cb());
        if (data !== null) {
            await readCache.set(key, data, EXPIRES_IN);
            return data;
        }
        return false;
    } catch (error) {
        return false;
    }
};

// update cache key value
export const updateCache = async (key: string, data: any) => {
    return readCache.update(key, data);
};

// delete cache key value
export const deleteCache = async (key: string) => {
    return readCache.delete(key);
};


