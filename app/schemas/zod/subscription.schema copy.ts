// /** @format */

// import { object, string, number, boolean, TypeOf } from "zod";

// const payload = {
//     body: object({
//         name: string({ required_error: "Subscription name is required" }),
//         description: string().optional(),
//         priceUSD: number({ required_error: "USD price is required" })
//             .min(0, "Price cannot be negative"),
//         apiRequestQuota: number({ required_error: "API request quota is required" })
//             .min(0, "Quota cannot be negative"),
//         durationDays: number()
//             .min(1, "Duration must be at least 1 day")
//             .default(365),
//         isActive: boolean().default(true),
//         isFreetier: boolean().default(false),
//         status: string({ required_error: "Status is required" })
//             .refine((val) => ["active", "paused", "expired", "cancelled"].includes(val), {
//                 message: "Invalid status value",
//             }),
//         startDate: string({ required_error: "Start date is required" }).refine(
//             (val) => !isNaN(Date.parse(val)),
//             { message: "Invalid date format" }
//         ),
//         endDate: string({ required_error: "End date is required" }).refine(
//             (val) => !isNaN(Date.parse(val)),
//             { message: "Invalid date format" }
//         ),
//         paymentId: string({ required_error: "Payment ID is required" }),
//     }),
// };

// const params = {
//     params: object({
//         subscriptionId: string({ required_error: "Subscription ID is required" }),
//     }),
// };

// export const createSubscriptionSchema = object({
//     ...payload,
// });

// export const getSubscriptionSchema = object({
//     ...params,
// });

// export const updateSubscriptionSchema = object({
//     ...params,
//     ...payload,
// });

// export const deleteSubscriptionSchema = object({
//     ...params,
// });

// export type CreateSubscriptionInput = TypeOf<typeof createSubscriptionSchema>;
// export type GetSubscriptionInput = TypeOf<typeof getSubscriptionSchema>;
// export type UpdateSubscriptionInput = TypeOf<typeof updateSubscriptionSchema>;
// export type DeleteSubscriptionInput = TypeOf<typeof deleteSubscriptionSchema>;
