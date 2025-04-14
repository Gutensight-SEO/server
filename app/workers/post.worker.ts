/** @format */

import { parentPort, workerData } from "worker_threads";
import { PostDocument } from "@/models";
import { v1Services } from "@/services";


let posts: PostDocument[] = [];
const worker = async (serviceName: string, params = null) => {
    posts = await v1Services[serviceName](params);
}
worker(workerData.serviceName, workerData.params);

parentPort?.postMessage(posts);