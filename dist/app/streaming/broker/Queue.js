"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = void 0;
const monitoring_1 = require("../../monitoring");
class MessageQueue {
    constructor() {
        this.queues = new Map();
    }
    createTopicQueue(topic) {
        if (!this.queues.has(topic)) {
            this.queues.set(topic, {
                name: topic,
                messages: []
            });
            monitoring_1.Logs.info('Queue Created:', `New queue created for topic ${topic}`);
        }
    }
    enqueue(topic, message) {
        const queue = this.queues.get(topic);
        if (!queue) {
            this.createTopicQueue(topic);
            this.enqueue(topic, message);
            return;
        }
        queue.messages.push(message);
    }
    dequeue(topic, consumerId) {
        const queue = this.queues.get(topic);
        if (!queue || queue.messages.length === 0)
            return null;
        // Find first unprocessed message
        const index = queue.messages.findIndex(msg => !msg.consumerId);
        if (index === -1)
            return null;
        // Mark message as being processed by this consumer
        const message = queue.messages[index];
        message.consumerId = consumerId;
        message.status = 'processing';
        // Remove message from queue
        queue.messages.splice(index, 1);
        return message;
    }
    getQueueLength(topic) {
        var _a;
        return ((_a = this.queues.get(topic)) === null || _a === void 0 ? void 0 : _a.messages.length) || 0;
    }
}
exports.MessageQueue = MessageQueue;
