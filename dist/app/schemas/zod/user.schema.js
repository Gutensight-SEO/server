"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.updateUserSchema = exports.getUserSchema = exports.loginUserSchema = exports.createUserSchema = exports.createUserBaseSchema = void 0;
const zod_1 = require("zod");
const payload = {
    body: (0, zod_1.object)({
        firstname: (0, zod_1.string)({ required_error: "First name is required" })
            .min(2, "First name must be at least 2 characters long")
            .max(12, "First name cannot be more than 12 characters long"),
        lastname: (0, zod_1.string)({ required_error: "Last name is required" })
            .min(2, "Last name must be at least 2 characters long")
            .max(12, "Last name cannot be more than 12 characters long"),
        username: (0, zod_1.string)({ required_error: "Username is required" })
            .min(2, "Username must be at least 2 characters long")
            .max(12, "Username cannot be more than 12 characters long"),
        email: (0, zod_1.string)({ required_error: "Email is required" })
            .email("Not a valid email"),
        password: (0, zod_1.string)({ required_error: "Password is required" })
            .min(8, "Password must be at least 8 characters long")
            .optional(),
        confirmPassword: (0, zod_1.string)({ required_error: "Password confirmation is required" })
            .optional(),
        role: (0, zod_1.string)({ required_error: "User Role is required" })
            .optional(),
    }),
};
const params = {
    params: (0, zod_1.object)({
        profileId: (0, zod_1.string)({ required_error: "User ID is required" }),
    }),
};
exports.createUserBaseSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.createUserSchema = exports.createUserBaseSchema.refine((data) => !data.body.password || data.body.password === data.body.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        detail: (0, zod_1.string)({ required_error: "Email or Username is required" })
            .min(2, "Login detail must be at least 2 characters length"),
        password: (0, zod_1.string)({ required_error: "Password is required" }),
    }),
});
exports.getUserSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateUserSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), payload));
exports.deleteUserSchema = (0, zod_1.object)(Object.assign({}, params));
