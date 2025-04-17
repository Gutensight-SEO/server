"use strict";
// /** @format */
// import { initializeDefaults } from "./utils";
// import express from "express";
// import { connectDB } from "./config";
// import { Logs } from "./monitoring";
// import { server_url, server_version } from "./globals";
// import { v1Routers } from "./routers";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import { errorHandler } from "./middlewares";
// const app = express();
// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// // Routes
// app.use(`${server_url}/${server_version}`, v1Routers);
// // Error handling middleware
// app.use(errorHandler);
// const startServer = async () => {
//     try {
//         // Connect to database
//         await connectDB();
//         // Initialize default data
//         await initializeDefaults();
//         // Start server
//         const PORT = process.env.PORT || 5000;
//         app.listen(PORT, () => {
//             Logs.info(`Server running on port ${PORT}`);
//         });
//     } catch (error) {
//         Logs.error("Server start error:", error);
//         process.exit(1);
//     }
// };
// startServer();
