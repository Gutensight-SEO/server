/** @format */

import { parentPort, workerData } from "worker_threads";
import { UserDocument } from "@/models";
import { v1Services } from "@/services";


let users: UserDocument[] = [];
const worker = async (serviceName: string, params = null) => {
    users = await v1Services[serviceName](params);
}
worker(workerData.serviceName, workerData.params);

parentPort?.postMessage(users);