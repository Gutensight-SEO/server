/** @format */

import cluster from 'cluster';
import os from 'os';
import { RunServer } from "@/setup";
import { Logs } from '@/monitoring';
import dotenv from "dotenv";


dotenv.config()


if (cluster.isPrimary) {
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
        cluster.fork();
    }

    // restart workers if they die
    cluster.on('exit', (worker, code, signal) => cluster.fork());
} else {
    Logs.info("Server starting...", "");
    RunServer();
}


// track memory usage
setInterval(() => {
    Logs.info("MEMORY STATUS:", `Worker ${process.pid} Memory: ${
      Math.round(process.memoryUsage().rss / 1024 / 1024)
    }MB`);
  }, 10000 * 6 * 10); // every 10 minutes // every 10 seconds
