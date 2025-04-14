/** @format */


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Logs } from '@/monitoring';


dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        Logs.info("Connecting to DB", `Ongoing...`)
        await mongoose.connect(process.env.MONGODB_URI!);
        Logs.success("Connected to DB:", `Successfully connected to DB`)
    } catch (error) {
        Logs.error(
            "Connect DB Error:", 
            `Error connecting to MongoDB Database!`
        );
        Logs.error("Connect DB Error RAW:", error);
        process.exit(1); 
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        Logs.info('Database', 'MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        Logs.error('Database', `Error during database shutdown: ${error}`);
        process.exit(1);
    }
});

export default connectDB;