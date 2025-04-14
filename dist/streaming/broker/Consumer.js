"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumerManager = exports.ConsumerManager = exports.Consumer = void 0;
const Broker_1 = require("./Broker");
const cacheDB_1 = require("@/cache/streaming/cacheDB");
const monitoring_1 = require("@/monitoring");
const crypto_1 = __importDefault(require("crypto"));
class Consumer {
    constructor(topic) {
        this.isRunning = false;
        this.id = crypto_1.default.randomUUID();
        this.topic = topic;
    }
    async start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        Broker_1.messageBroker.registerConsumer({ id: this.id, topic: this.topic });
        this.poll();
    }
    async poll() {
        while (this.isRunning) {
            try {
                const message = Broker_1.messageBroker.getNextMessage(this.topic, this.id);
                if (message) {
                    try {
                        // Execute the callback function
                        const result = await message.callback();
                        // Store result in cache with proper structure
                        const cacheData = {
                            status: 'completed',
                            success: true,
                            result: result, // This will be returned as 'response' in getStreamingRecord
                            timestamp: Date.now()
                        };
                        await (0, cacheDB_1.addStreamingRecord)(message.correlationId, cacheData);
                    }
                    catch (error) {
                        // Store error with proper structure
                        const errorData = {
                            status: 'completed',
                            success: false,
                            error: true,
                            result: error.message, // This will be returned as 'response' in getStreamingRecord
                            timestamp: Date.now()
                        };
                        await (0, cacheDB_1.addStreamingRecord)(message.correlationId, errorData);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            catch (error) {
                monitoring_1.Logs.error(`Consumer ${this.id} poll error:`, error);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }
    stop() {
        this.isRunning = false;
    }
}
exports.Consumer = Consumer;
// Consumer manager to handle multiple consumers per topic
class ConsumerManager {
    constructor() {
        this.consumers = new Map();
        this.numConsumersPerTopic = Number(process.env.NUM_OF_CONSUMERS) || 2;
    }
    static getInstance() {
        if (!ConsumerManager.instance) {
            ConsumerManager.instance = new ConsumerManager();
        }
        return ConsumerManager.instance;
    }
    async startConsumers(topics) {
        for (const topic of topics) {
            const topicConsumers = [];
            for (let i = 0; i < this.numConsumersPerTopic; i++) {
                const consumer = new Consumer(topic);
                await consumer.start();
                topicConsumers.push(consumer);
            }
            this.consumers.set(topic, topicConsumers);
        }
    }
    stopAll() {
        for (const consumers of this.consumers.values()) {
            consumers.forEach(consumer => consumer.stop());
        }
    }
}
exports.ConsumerManager = ConsumerManager;
exports.consumerManager = ConsumerManager.getInstance();
