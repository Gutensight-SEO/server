"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisWorker = exports.userWorker = void 0;
const worker_threads_1 = require("worker_threads");
const userWorker = (serviceName, params = null) => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker("./user.worker.ts", {
            workerData: {
                serviceName, params
            }
        });
        worker.on("message", (data) => {
            resolve(data);
        });
        worker.on("error", (error) => {
            reject(error);
        });
    });
};
exports.userWorker = userWorker;
// const postWorker = (serviceName: string, params = null) => {
//     return new Promise((resolve, reject) => {
//         const worker = new Worker("./post.worker.ts", {
//             workerData: {
//                 serviceName, params
//             }
//         });
//         worker.on("message", (data) => {
//             resolve(data);
//         })
//         worker.on("error", (error) => {
//             reject(error);
//         })
//     })
// }
const analysisWorker = (cb) => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker("./analysis.worker.ts", {
            workerData: {
                cb
            }
        });
        worker.on("message", (data) => {
            resolve(data);
        });
        worker.on("error", (error) => {
            reject(error);
        });
    });
};
exports.analysisWorker = analysisWorker;
