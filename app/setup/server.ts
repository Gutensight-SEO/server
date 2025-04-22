/** @format */

import dotenv from "dotenv";
import app from "../app";
import connectDB from "./database";
import { Logs, Metrics } from "@/monitoring";
import { consumerManager, messageBroker } from "@/streaming";
import { KAFKA_TOPICS } from "@/constants";
import { initializeDefaults } from "@/utils";

dotenv.config();

const port = process.env.PORT || 5000;

const runServer = async () => {
    try {
        Logs.info("Server starting", "...");
        
        // Start messaging
        await messageBroker.init();
        await consumerManager.startConsumers(Object.values(KAFKA_TOPICS));

        // Connect to database first
        await connectDB();

        // Start app server
        const server = app.listen(port, () => {
            Logs.success(`Server running in ${process.env.NODE_ENV ? "Development" : "Production"} Mode on port -`, port);
        });

        // Start metrics server
        Metrics.startServerMetrics();

        // Delay initialization with proper async/await
        await new Promise(resolve => setTimeout(resolve, 60000)); // 60 seconds
        await initializeDefaults();

        // Cleanup on shutdown
        process.on('SIGINT', async () => {
            Logs.info("Server shutting down", "...");
            await consumerManager.stopAll();
            server.close(() => {
                process.exit(0);
            });
        });
    } catch (error) {
        Logs.error("Run Server Error:", error);
        process.exit(1);
    }
}

export default runServer;