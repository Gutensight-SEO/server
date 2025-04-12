/** @format */

import mongoose, { Document, Schema } from "mongoose";

export interface NotificationDocument extends Document {
    _id: string;
    userId: string;
    type: string;
    message: string;
    read: boolean;
    relatedId?: string;
    createdAt: Date;
}

const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<NotificationDocument>('Notification', notificationSchema);