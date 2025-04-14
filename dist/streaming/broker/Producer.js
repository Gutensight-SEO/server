"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.producer = exports.Producer = void 0;
const Broker_1 = require("./Broker");
const monitoring_1 = require("@/monitoring");
const crypto_1 = __importDefault(require("crypto"));
class Producer {
    constructor() { }
    static getInstance() {
        if (!Producer.instance) {
            Producer.instance = new Producer();
        }
        return Producer.instance;
    }
    async publish(topic, callback) {
        try {
            const correlationId = crypto_1.default.randomUUID();
            const message = {
                id: `${Date.now()}-${Math.random().toString(36)}`,
                topic,
                timestamp: Date.now(),
                correlationId,
                callback
            };
            await Broker_1.messageBroker.publish(message);
            return correlationId;
        }
        catch (error) {
            monitoring_1.Logs.error('Producer publish error:', error);
            throw error;
        }
    }
}
exports.Producer = Producer;
exports.producer = Producer.getInstance();
