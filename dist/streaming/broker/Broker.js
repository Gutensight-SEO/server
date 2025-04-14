"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageBroker = exports.MessageBroker = void 0;
const Queue_1 = require("./Queue");
const monitoring_1 = require("@/monitoring");
class MessageBroker {
    constructor() {
        this.initialized = false;
        this.queue = new Queue_1.MessageQueue();
        this.consumers = new Map();
    }
    static getInstance() {
        if (!MessageBroker.instance) {
            MessageBroker.instance = new MessageBroker();
        }
        return MessageBroker.instance;
    }
    async init() {
        if (this.initialized)
            return;
        try {
            this.initialized = true;
            monitoring_1.Logs.info('MessageBroker:', 'Initialized successfully');
        }
        catch (error) {
            monitoring_1.Logs.error('MessageBroker initialization failed:', error);
            throw error;
        }
    }
    registerConsumer(config) {
        var _a;
        const { topic } = config;
        if (!this.consumers.has(topic)) {
            this.consumers.set(topic, new Set());
        }
        (_a = this.consumers.get(topic)) === null || _a === void 0 ? void 0 : _a.add(config);
        this.queue.createTopicQueue(topic);
    }
    async publish(message) {
        try {
            const queueMessage = Object.assign(Object.assign({}, message), { status: 'pending' });
            this.queue.enqueue(message.topic, queueMessage);
            return message.id;
        }
        catch (error) {
            monitoring_1.Logs.error('Error publishing message:', error);
            throw error;
        }
    }
    getNextMessage(topic, consumerId) {
        return this.queue.dequeue(topic, consumerId);
    }
}
exports.MessageBroker = MessageBroker;
exports.messageBroker = MessageBroker.getInstance();
