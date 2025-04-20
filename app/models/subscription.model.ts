import mongoose, { Document, Schema } from "mongoose";

export interface SubscriptionDocument extends Document {
  userId: Schema.Types.ObjectId;
  subscriptionPlanId: Schema.Types.ObjectId;
  apiKey: string;
  status: 'active' | 'paused' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  pausedAt?: Date;
  totalApiRequests: number;
  usedApiRequests: number;
  remainingApiRequests: number;
  paymentId: string;
}

const subscriptionSchema = new Schema({
  userId: { type: String, required: true, ref: 'User' },
  subscriptionPlanId: { type: String, required: true, ref: 'SubscriptionPlan' },
  apiKey: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'paused', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  pausedAt: { type: Date },
  totalApiRequests: { type: Number, required: true },
  usedApiRequests: { type: Number, default: 0 },
  remainingApiRequests: { type: Number, required: true },
  paymentId: { type: String, required: true }
}, { 
  timestamps: true,
  indexes: [
    { userId: 1, status: 1 },
    { apiKey: 1 }
  ]
});

export default mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);