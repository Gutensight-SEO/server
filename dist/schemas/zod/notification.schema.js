"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotificationSchema = exports.updateNotificationSchema = exports.getNotificationSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        subject: (0, zod_1.string)({
            required_error: "Notification subject is required",
        }),
        body: (0, zod_1.string)({
            required_error: "Notification body is required",
        }),
        reference: (0, zod_1.string)({
            required_error: "Reference ID is required"
        })
    }),
};
const params = {
    params: (0, zod_1.object)({
        notificationId: (0, zod_1.string)({
            required_error: "Notification ID is required"
        })
    })
};
exports.createNotificationSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.getNotificationSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateNotificationSchema = (0, zod_1.object)(Object.assign(Object.assign({}, payload), params));
exports.deleteNotificationSchema = (0, zod_1.object)(Object.assign({}, params));
