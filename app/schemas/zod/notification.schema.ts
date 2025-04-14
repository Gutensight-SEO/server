/** @format */

import { object, number, string, TypeOf } from "zod";


const payload = {
    body: object({
        subject: string({
            required_error: "Notification subject is required",
        }),
        body: string({
            required_error: "Notification body is required",
        }),
        reference: string({
            required_error: "Reference ID is required"
        })
    }),
}

const params = {
    params: object({
        notificationId: string({
            required_error: "Notification ID is required"
        })
    })
};

export const createNotificationSchema = object({
    ...payload,
});

export const getNotificationSchema = object({
    ...params,
});

export const updateNotificationSchema = object({
    ...payload,
    ...params,
});

export const deleteNotificationSchema = object({
    ...params,
});


export type CreateNotificationInput = TypeOf<typeof createNotificationSchema>;
export type GetNotificationInput    = TypeOf<typeof getNotificationSchema>;
export type UpdateNotificationInput = TypeOf<typeof updateNotificationSchema>;
export type deleteNotificationInput = TypeOf<typeof deleteNotificationSchema>;