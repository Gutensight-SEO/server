/** @format */

import { object, string, TypeOf } from "zod";

const payload = {
    body: object({
        firstname: string({ required_error: "First name is required" })
            .min(2, "First name must be at least 2 characters long")
            .max(12, "First name cannot be more than 12 characters long"),
        lastname: string({ required_error: "Last name is required" })
            .min(2, "Last name must be at least 2 characters long")
            .max(12, "Last name cannot be more than 12 characters long"),
        username: string({ required_error: "Username is required" })
            .min(2, "Username must be at least 2 characters long")
            .max(12, "Username cannot be more than 12 characters long"),
        email: string({ required_error: "Email is required" })
            .email("Not a valid email"),
        password: string({ required_error: "Password is required" })
            .min(8, "Password must be at least 8 characters long")
            .optional(), 
        confirmPassword: string({ required_error: "Password confirmation is required" })
            .optional(), 
        role: string({ required_error: "User Role is required" })
            .optional(), 
    }),
};

const params = {
    params: object({
        profileId: string({ required_error: "User ID is required" }),
    }),
};

export const createUserBaseSchema = object({
    ...payload,
});

export const createUserSchema = createUserBaseSchema.refine(
    (data) => !data.body.password || data.body.password === data.body.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);

export const loginUserSchema = object({
    body: object({
        detail: string({ required_error: "Email or Username is required" })
            .min(2, "Login detail must be at least 2 characters length"),
        password: string({ required_error: "Password is required" }),
    }),
});

export const getUserSchema = object({ ...params });

export const updateUserSchema = object({
    ...params,
    ...payload,
});

export const deleteUserSchema = object({ ...params });

export type CreateUserInput = Omit<TypeOf<typeof createUserBaseSchema>, "body.confirmPassword">;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type GetUserInput = TypeOf<typeof getUserSchema>;
export type UpdateUserInput = Omit<TypeOf<typeof updateUserSchema>, "body.confirmPassword">;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
