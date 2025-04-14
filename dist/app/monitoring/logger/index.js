"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const customLogger_1 = __importDefault(require("./customLogger"));
const { combine, errors, json, printf, timestamp } = winston_1.format;
const Logger = () => {
    const logFormat = printf(({ level, message, stack, timestamp }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });
    const formatLogs = winston_1.format.combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }));
    return (0, winston_1.createLogger)({
        format: winston_1.format.combine(formatLogs),
        defaultMeta: { service: "MERN_TEMPLATE_API" },
        transports: [
            new winston_1.transports.Console({
                format: combine(winston_1.format.colorize(), logFormat),
            }),
            new customLogger_1.default({ format: combine(json()) })
        ]
    });
};
exports.default = Logger;
