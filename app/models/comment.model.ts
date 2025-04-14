/** @format */

import mongoose, { Document, Schema } from "mongoose";

export interface CommentDocument extends Document {
    _id: string;
    postId: string;
    userId: string;
    content: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
}, { timestamps: true });

export default mongoose.model<CommentDocument>('Comment', commentSchema);