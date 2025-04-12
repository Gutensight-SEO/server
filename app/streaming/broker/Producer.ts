import { Message } from './types';
import { messageBroker } from './Broker';
import { Logs } from '@/monitoring';
import crypto from 'crypto';

export class Producer {
    private static instance: Producer;

    private constructor() {}

    static getInstance(): Producer {
        if (!Producer.instance) {
            Producer.instance = new Producer();
        }
        return Producer.instance;
    }

    async publish(
        topic: string, 
        callback: () => Promise<any>
    ): Promise<string> {
        try {
            const correlationId = crypto.randomUUID();

            const message: Message = {
                id: `${Date.now()}-${Math.random().toString(36)}`,
                topic,
                timestamp: Date.now(),
                correlationId,
                callback
            };

            await messageBroker.publish(message);
            return correlationId;
        } catch (error) {
            Logs.error('Producer publish error:', error);
            throw error;
        }
    }
}

export const producer = Producer.getInstance();
