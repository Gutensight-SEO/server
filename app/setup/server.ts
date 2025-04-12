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
        // start messaging
        await messageBroker.init();
        await consumerManager.startConsumers(Object.values(KAFKA_TOPICS));

        // app server
        app.listen(port, async () => {
            Logs.success(`Server running in ${process.env.DEV_MODE ? "Development" : "Production"} Mode on port -`, port);
        
            // connect db
            await connectDB();
        })

        // metrics server
        Metrics.startServerMetrics();

        // initialize default accounts
        await initializeDefaults();

        // cleanup on shutdown
        process.on('SIGINT', () => {
            consumerManager.stopAll();
            // messageBroker.close();
            process.exit(0);
        })
    } catch (error) {
        Logs.error("Run Server Error:", error);
    }
}

export default runServer;