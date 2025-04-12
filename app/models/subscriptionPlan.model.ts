import mongoose, { Document, Schema } from "mongoose";


export interface SubscriptionPlanDocument extends Document {
  name: string;
  description?: string;
  priceUSD: number;
  apiRequestQuota: number;
  durationDays: number; 
  isActive: boolean;
  isFreetier: boolean;
  paymentLink: string;
}

const subscriptionPlanSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  priceUSD: { type: Number, required: true },
  apiRequestQuota: { type: Number, required: true },
  durationDays: { type: Number, default: 365 }, // yearly subscriptionPlan
  isActive: { type: Boolean, default: true },
  isFreetier: { type: Boolean, default: false },
  paymentLink: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<SubscriptionPlanDocument>('SubscriptionPlan', subscriptionPlanSchema);