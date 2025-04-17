"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const services_1 = require("../services");
let users = [];
const worker = async (serviceName, params = null) => {
    users = await services_1.v1Services[serviceName](params);
};
worker(worker_threads_1.workerData.serviceName, worker_threads_1.workerData.params);
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(users);
