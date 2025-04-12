import dotenv from 'dotenv';
dotenv.config();

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
    // console.log("API_SECRET:", process.env.TEST_PAYSTACK_SECRET_KEY);
    console.log("API_SECRET:", "sk_test_99c3c12d3f4bc7cf1ec2b333e8ba6d539edb6b75")
    // if (!process.env.TEST_PAYSTACK_SECRET_KEY) {
    //     throw new Error('Paystack secret key is not configured');
    // }

    try {
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${paymentId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${process.env.TEST_PAYSTACK_SECRET_KEY}`,
                    'Authorization': `Bearer sk_test_99c3c12d3f4bc7cf1ec2b333e8ba6d539edb6b75`,
                },
            }
        );

        const payment = await response.json() as PaystackVerifyResponse;
        console.log("PAYMENT:", payment)
        
        return payment.data?.status === "success";
    } catch (error) {
        console.error("Payment verification error:", error);
        throw error;
    }
}

// const paymentId = "1";
// verifyPayment(paymentId);

// sample response
// {
//     "status": true,
//     "message": "Verification successful",
//     "data": {
//       "id": 4099260516,
//       "domain": "test",
//       "status": "success",
//       "reference": "re4lyvq3s3",
//       "receipt_number": null,
//       "amount": 40333,
//       "message": null,
//       "gateway_response": "Successful",
//       "paid_at": "2024-08-22T09:15:02.000Z",
//       "created_at": "2024-08-22T09:14:24.000Z",
//       "channel": "card",
//       "currency": "NGN",
//       "ip_address": "197.210.54.33",
//       "metadata": "",
//       "log": {
//         "start_time": 1724318098,
//         "time_spent": 4,
//         "attempts": 1,
//         "errors": 0,
//         "success": true,
//         "mobile": false,
//         "input": [],
//         "history": [
//           {
//             "type": "action",
//             "message": "Attempted to pay with card",
//             "time": 3
//           },
//           {
//             "type": "success",
//             "message": "Successfully paid with card",
//             "time": 4
//           }
//         ]
//       },
//       "fees": 10283,
//       "fees_split": null,
//       "authorization": {
//         "authorization_code": "AUTH_uh8bcl3zbn",
//         "bin": "408408",
//         "last4": "4081",
//         "exp_month": "12",
//         "exp_year": "2030",
//         "channel": "card",
//         "card_type": "visa ",
//         "bank": "TEST BANK",
//         "country_code": "NG",
//         "brand": "visa",
//         "reusable": true,
//         "signature": "SIG_yEXu7dLBeqG0kU7g95Ke",
//         "account_name": null
//       },
//       "customer": {
//         "id": 181873746,
//         "first_name": null,
//         "last_name": null,
//         "email": "demo@test.com",
//         "customer_code": "CUS_1rkzaqsv4rrhqo6",
//         "phone": null,
//         "metadata": null,
//         "risk_action": "default",
//         "international_format_phone": null
//       },
//       "plan": null,
//       "split": {},
//       "order_id": null,
//       "paidAt": "2024-08-22T09:15:02.000Z",
//       "createdAt": "2024-08-22T09:14:24.000Z",
//       "requested_amount": 30050,
//       "pos_transaction_data": null,
//       "source": null,
//       "fees_breakdown": null,
//       "connect": null,
//       "transaction_date": "2024-08-22T09:14:24.000Z",
//       "plan_object": {},
//       "subaccount": {}
//     }
//   }

// Example usage
const verifyTransaction = async () => {
    try {
        const result = await verifyPayment("TRANSACTION_ID");
        console.log("Verification result:", result);

        if (result) console.log("TRUE")
        else console.log("FALSE")
    } catch (error) {
        console.error("Verification failed:", error);
    }
}

verifyTransaction();