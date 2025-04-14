/** @format */

import { Worker } from "worker_threads";


const userWorker = (serviceName: string, params = null) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./user.worker.ts", {
            workerData: {
                serviceName, params
            }
        });

        worker.on("message", (data) => {
            resolve(data);
        });

        worker.on("error", (error) => {
            reject(error);
        })
    })
};

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

const analysisWorker = (cb: any) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./analysis.worker.ts", {
            workerData: {
                cb
            }
        });

        worker.on("message", (data) => {
            resolve(data);
        })

        worker.on("error", (error) => {
            reject(error);
        })
    })
}

// commentWorker
// notificationWorker


export {
    userWorker,
    // postWorker,
    analysisWorker
};