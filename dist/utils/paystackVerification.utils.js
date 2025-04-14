"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyPayment = async (paymentId) => {
    // if (!process.env.LIVE_PAYSTACK_SECRET_KEY) {
    //     throw new Error('Paystack secret key is not configured');
    // }
    var _a;
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${paymentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LIVE_PAYSTACK_SECRET_KEY}`,
            },
        });
        const payment = await response.json();
        return ((_a = payment.data) === null || _a === void 0 ? void 0 : _a.status) === "success";
    }
    catch (error) {
        console.error("Payment verification error:", error);
        throw error;
    }
};
exports.default = verifyPayment;
