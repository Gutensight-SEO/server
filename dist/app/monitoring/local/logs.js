"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const dayjs_1 = __importDefault(require("dayjs"));
const colors_1 = __importDefault(require("colors"));
colors_1.default.enable();
const LocalLogs = (0, pino_1.default)({
    base: {
        pid: false,
    },
    timestamp: () => `, "time": "${(0, dayjs_1.default)().format()}"`,
});
const Logs = {
    error(title, message) {
        console.error(`${title}`.bgRed, `${message}`.bgRed);
        // console.error(message?.message)
        LocalLogs.error(title, message);
    },
    group(title, message) {
        console.group();
        console.groupCollapsed(`==================================`.bgWhite);
        console.group(title, message);
        // console.group(`${message}`.bgBlack);
        console.groupCollapsed(`==================================`.bgWhite);
        console.groupEnd();
    },
    info(title, message) {
        // console.info(title, message);
        console.info(`${title}`.bgBlue, `${message}`.bgBlue);
        LocalLogs.info(title, message);
    },
    success(title, message) {
        // console.log(title, message)
        console.log(`${title}`.bgGreen, `${message}`.bgGreen);
        LocalLogs.info(title, message);
    }
};
exports.default = Logs;
