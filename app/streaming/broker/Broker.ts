import { MessageQueue } from './Queue';
import { Message, QueueMessage, ConsumerConfig } from './types';
import { Logs } from '@/monitoring';

export class MessageBroker {
    private static instance: MessageBroker;
    private queue: MessageQueue;
    private consumers: Map<string, Set<ConsumerConfig>>;
    private initialized: boolean = false;

    private constructor() {
        this.queue = new MessageQueue();
        this.consumers = new Map();
    }

    static getInstance(): MessageBroker {
        if (!MessageBroker.instance) {
            MessageBroker.instance = new MessageBroker();
        }
        return MessageBroker.instance;
    }

    async init(): Promise<void> {
        if (this.initialized) return;
        
        try {
            this.initialized = true;
            Logs.info('MessageBroker:', 'Initialized successfully');
        } catch (error) {
            Logs.error('MessageBroker initialization failed:', error);
            throw error;
        }
    }

    registerConsumer(config: ConsumerConfig): void {
        const { topic } = config;
        if (!this.consumers.has(topic)) {
            this.consumers.set(topic, new Set());
        }
        this.consumers.get(topic)?.add(config);
        this.queue.createTopicQueue(topic);
    }

    async publish(message: Message): Promise<string> {
        try {
            const queueMessage: QueueMessage = {
                ...message,
                status: 'pending'
            };
            
            this.queue.enqueue(message.topic, queueMessage);
            return message.id;
        } catch (error) {
            Logs.error('Error publishing message:', error);
            throw error;
        }
    }

    getNextMessage(topic: string, consumerId: string): QueueMessage | null {
        return this.queue.dequeue(topic, consumerId);
    }
}

export const messageBroker = MessageBroker.getInstance();
