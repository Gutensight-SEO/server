/** @format */

import mongoose, { Document, Schema } from "mongoose";

export interface PostDocument extends Document {
    user: string;
    title: string;
    body: string;
    comments?: string[];
}

const postSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author is required"]
        },
        title: {
            type: String,
            minLength: [2, "Post title must be at least 2 characters long"],
            maxLength: [200, "Post title must not be more than 200 characters long"],
            required: [true, "Post title is required"]
        },
        body: {
            type: String,
            minLength: [2, "Post body must be at least 2 characters long"],
            maxLength: [1200, "Post body must not be more than 200 characters long"],
            required: [true, "Post body is required"]
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment",
        }]
    },
    {
        timestamps: true
    }
)

export default mongoose.model<PostDocument>('Post', postSchema);