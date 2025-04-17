"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("../app"));
const database_1 = __importDefault(require("./database"));
const monitoring_1 = require("../monitoring");
const streaming_1 = require("../streaming");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const runServer = async () => {
    try {
        monitoring_1.Logs.info("Server starting", "...");
        // start messaging
        await streaming_1.messageBroker.init();
        await streaming_1.consumerManager.startConsumers(Object.values(constants_1.KAFKA_TOPICS));
        // app server
        app_1.default.listen(port, async () => {
            monitoring_1.Logs.success(`Server running in ${process.env.NODE_ENV ? "Development" : "Production"} Mode on port -`, port);
            // connect db
            await (0, database_1.default)();
        });
        // metrics server
        monitoring_1.Metrics.startServerMetrics();
        // initialize default accounts
        await (0, utils_1.initializeDefaults)();
        // cleanup on shutdown
        process.on('SIGINT', () => {
            streaming_1.consumerManager.stopAll();
            // messageBroker.close();
            process.exit(0);
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Run Server Error:", error);
    }
};
exports.default = runServer;
