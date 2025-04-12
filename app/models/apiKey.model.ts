/** @format */

import mongoose, { Document, Schema } from "mongoose";

export interface ApiKeyDocument extends Document {
    subscription_name: string;
    subscription_id: Schema.Types.ObjectId;
    
    key_hash: string;
    secret_hash: string;
    user_id: string;
    requests_remaining: number;
    created_at: Date;
}

const ApiKeySchema = new Schema({
  subscription_name: { type: String, required: true },
  subscription_id: { type: String, required: true, ref: 'Subscription' },
  key_hash: { type: String, required: true, unique: true },
  secret_hash: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  requests_remaining: { type: Number, default: 100 },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<ApiKeyDocument>("ApiKey", ApiKeySchema);