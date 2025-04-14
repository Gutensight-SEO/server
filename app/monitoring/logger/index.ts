/** @format */


import { createLogger, format, transports } from 'winston';
import customLogger from './customLogger';


const { combine, errors, json, printf, timestamp } = format;

const Logger = () => {
    const logFormat = printf(({ level, message, stack, timestamp }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });

    const formatLogs = format.combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true })
    );

    return createLogger({
        format: format.combine(formatLogs),
        defaultMeta: { service: "MERN_TEMPLATE_API" },
        transports: [
            new transports.Console({
                format: combine(format.colorize(), logFormat),
            }),
            new customLogger({ format: combine(json()) })
        ]
    })
}

export default Logger;