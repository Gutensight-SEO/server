/** @format */

import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    role: string;
    refreshToken?: string;
    subscription?: string[];
}

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    refreshToken: { type: String },
    subscription: [{type: Schema.Types.ObjectId, ref: "Subscription"}]
});

export default mongoose.model<UserDocument>('User', userSchema);