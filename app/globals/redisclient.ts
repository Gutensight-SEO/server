// /** @format */


// import { createClient } from "redis";
// import dotenv from "dotenv";
// import { Logs } from "@/monitoring";


// dotenv.config();

// // set up redis

// const REDIS_URI = process.env.REDIS_URI

// export const redisClient = createClient({
//     socket: {
//       host: process.env.REDIS_HOST || 'localhost',
//       port: parseInt(process.env.REDIS_PORT || '6379', 10),
//     },
//   });

// export const initRedis = async () => {
//     redisClient.on("connect", () => {
//         Logs.success("Redis client connected", "");
//     });
    
//     redisClient.on("error", (error) => {
//         Logs.error("Redis not connected", error);
//     });
// }

// // export default redisClient;