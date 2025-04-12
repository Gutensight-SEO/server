import { QueueMessage, TopicQueue } from './types';
import { Logs } from '@/monitoring';

export class MessageQueue {
    private queues: Map<string, TopicQueue>;

    constructor() {
        this.queues = new Map();
    }

    createTopicQueue(topic: string): void {
        if (!this.queues.has(topic)) {
            this.queues.set(topic, {
                name: topic,
                messages: []
            });
            Logs.info('Queue Created:', `New queue created for topic ${topic}`);
        }
    }

    enqueue(topic: string, message: QueueMessage): void {
        const queue = this.queues.get(topic);
        if (!queue) {
            this.createTopicQueue(topic);
            this.enqueue(topic, message);
            return;
        }
        queue.messages.push(message);
    }

    dequeue(topic: string, consumerId: string): QueueMessage | null {
        const queue = this.queues.get(topic);
        if (!queue || queue.messages.length === 0) return null;

        // Find first unprocessed message
        const index = queue.messages.findIndex(msg => !msg.consumerId);
        if (index === -1) return null;

        // Mark message as being processed by this consumer
        const message = queue.messages[index];
        message.consumerId = consumerId;
        message.status = 'processing';
        
        // Remove message from queue
        queue.messages.splice(index, 1);
        
        return message;
    }

    getQueueLength(topic: string): number {
        return this.queues.get(topic)?.messages.length || 0;
    }
}
