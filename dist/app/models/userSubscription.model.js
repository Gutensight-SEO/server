"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSubscriptionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    apiKey: { type: String, required: true },
    apiSecret: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    requestsUsed: { type: Number, default: 0 },
    totalRequests: { type: Number, required: true },
    paymentType: { type: String, enum: ['paystack', 'crypto', 'free'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    transactionHash: { type: String }, // for crypto payments
    paystackReference: { type: String } // for paystack payments
}, { timestamps: true });
exports.default = mongoose_1.default.model('UserSubscription', userSubscriptionSchema);
