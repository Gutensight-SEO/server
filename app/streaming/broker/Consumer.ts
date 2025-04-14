import { ConsumerConfig, QueueMessage } from './types';
import { messageBroker } from './Broker';
import { addStreamingRecord } from '@/cache/streaming/cacheDB';
import { Logs } from '@/monitoring';
import crypto from 'crypto';

export class Consumer {
    private id: string;
    private topic: string;
    private isRunning: boolean = false;

    constructor(topic: string) {
        this.id = crypto.randomUUID();
        this.topic = topic;
    }

    async start(): Promise<void> {
        if (this.isRunning) return;

        this.isRunning = true;
        messageBroker.registerConsumer({ id: this.id, topic: this.topic });

        this.poll();
    }

    private async poll(): Promise<void> {
        while (this.isRunning) {
            try {
                const message = messageBroker.getNextMessage(this.topic, this.id);
                
                if (message) {
                    try {
                        // Execute the callback function
                        const result = await message.callback();
                        
                        // Store result in cache with proper structure
                        const cacheData = {
                            status: 'completed',
                            success: true,
                            result: result,  // This will be returned as 'response' in getStreamingRecord
                            timestamp: Date.now()
                        };
                        
                        await addStreamingRecord(message.correlationId, cacheData);
                    } catch (error: any) {
                        // Store error with proper structure
                        const errorData = {
                            status: 'completed',
                            success: false,
                            error: true,
                            result: error.message,  // This will be returned as 'response' in getStreamingRecord
                            timestamp: Date.now()
                        };
                        
                        await addStreamingRecord(message.correlationId, errorData);
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                Logs.error(`Consumer ${this.id} poll error:`, error);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }

    stop(): void {
        this.isRunning = false;
    }
}

// Consumer manager to handle multiple consumers per topic
export class ConsumerManager {
    private static instance: ConsumerManager;
    private consumers: Map<string, Consumer[]> = new Map();
    private numConsumersPerTopic: number;

    private constructor() {
        this.numConsumersPerTopic = Number(process.env.NUM_OF_CONSUMERS) || 2;
    }

    static getInstance(): ConsumerManager {
        if (!ConsumerManager.instance) {
            ConsumerManager.instance = new ConsumerManager();
        }
        return ConsumerManager.instance;
    }

    async startConsumers(topics: string[]): Promise<void> {
        for (const topic of topics) {
            const topicConsumers: Consumer[] = [];
            
            for (let i = 0; i < this.numConsumersPerTopic; i++) {
                const consumer = new Consumer(topic);
                await consumer.start();
                topicConsumers.push(consumer);
            }
            
            this.consumers.set(topic, topicConsumers);
        }
    }

    stopAll(): void {
        for (const consumers of this.consumers.values()) {
            consumers.forEach(consumer => consumer.stop());
        }
    }
}

export const consumerManager = ConsumerManager.getInstance();
