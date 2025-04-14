/** @format */

import { parentPort, workerData } from "worker_threads";


let analysis: any = null;
const worker = async (cb) => {
    analysis = await Promise.resolve(cb);
}
worker(workerData.cb);

parentPort?.postMessage(analysis);