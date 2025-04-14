"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const monitoring_1 = require("../monitoring");
dotenv_1.default.config();
const connectDB = async () => {
    try {
        monitoring_1.Logs.info("Connecting to DB", `Ongoing...`);
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        monitoring_1.Logs.success("Connected to DB:", `Successfully connected to DB`);
    }
    catch (error) {
        monitoring_1.Logs.error("Connect DB Error:", `Error connecting to MongoDB Database!`);
        monitoring_1.Logs.error("Connect DB Error RAW:", error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose_1.default.connection.close();
        monitoring_1.Logs.info('Database', 'MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (error) {
        monitoring_1.Logs.error('Database', `Error during database shutdown: ${error}`);
        process.exit(1);
    }
});
exports.default = connectDB;
