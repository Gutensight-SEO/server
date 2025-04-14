export interface Message {
    id: string;
    topic: string;
    timestamp: number;
    correlationId: string;
    callback: () => Promise<any>;
}

export interface QueueMessage extends Message {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    consumerId?: string;
}

export interface TopicQueue {
    name: string;
    messages: QueueMessage[];
}

export interface ConsumerConfig {
    id: string;
    topic: string;
}

export type MessageHandler = (message: Message) => Promise<void>;
