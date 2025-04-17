"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const setup_1 = require("../setup");
const monitoring_1 = require("../monitoring");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (cluster_1.default.isPrimary) {
    // const numCPUs = os.cpus().length - 2; // 'prod'
    const numCPUs = Number(process.env.WORKER_COUNT); // 'dev'
    // const numCPUs = process.env.WORKER_COUNT
    //     ? parseInt(process.env.WORKER_COUNT)
    //     : os.cpus().length - 2; // 'Prod' with docker; max 4 workers
    //     // : Math.min(4, os.cpus().length); // 'Prod' with docker; max 4 workers
    // console.log(`number of cpu available:`, numCPUs+1);
    console.log(`Master process ${process.pid} is running...`);
    console.log(`Forking ${numCPUs} workers...`);
    // create workers
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    // restart workers if they die
    cluster_1.default.on('exit', (worker, code, signal) => cluster_1.default.fork());
}
else {
    monitoring_1.Logs.info("Server starting...", "");
    (0, setup_1.RunServer)();
}
// track memory usage
setInterval(() => {
    monitoring_1.Logs.info("MEMORY STATUS:", `Worker ${process.pid} Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
}, 10000 * 6 * 10); // every 10 minutes // every 10 seconds
