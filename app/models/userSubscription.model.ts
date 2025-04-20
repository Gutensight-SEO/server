import mongoose, { Schema } from "mongoose";

const userSubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
  apiKey: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  requestsUsed: { type: Number, default: 0 },
  totalRequests: { type: Number, required: true },
  paymentType: { type: String, enum: ['paystack', 'crypto', 'free'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  transactionHash: { type: String }, // for crypto payments
  paystackReference: { type: String } // for paystack payments
}, { timestamps: true });

export default mongoose.model('UserSubscription', userSubscriptionSchema);