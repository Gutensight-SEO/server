"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
let analysis = null;
const worker = async (cb) => {
    analysis = await Promise.resolve(cb);
};
worker(worker_threads_1.workerData.cb);
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(analysis);
