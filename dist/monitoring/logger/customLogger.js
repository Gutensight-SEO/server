"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_transport_1 = __importDefault(require("winston-transport"));
const local_1 = require("../local");
const streaming_1 = require("@/streaming");
class customTransport extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
    }
    log(info, callback) {
        const correlationId = streaming_1.producer.publish("MERN_TEMPLATE_API_LOGGER", () => Promise.resolve(info[Symbol.for("message")])).catch(error => local_1.Logs.error("Custom Transport Error:", error));
        callback();
    }
}
exports.default = customTransport;
