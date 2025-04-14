/** @format */

import dotenv from "dotenv";


dotenv.config();


// verify payment
interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data?: {
        status: string;
        reference: string;
        amount: number;
        // Add other fields as needed
    };
}

const verifyPayment = async (paymentId: string): Promise<Boolean> => {
    // if (!process.env.LIVE_PAYSTACK_SECRET_KEY) {
    //     throw new Error('Paystack secret key is not configured');
    // }

    try {
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${paymentId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LIVE_PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const payment = await response.json() as PaystackVerifyResponse;

        return payment.data?.status === "success";
    } catch (error) {
        console.error("Payment verification error:", error);
        throw error;
    }
}


export default verifyPayment;