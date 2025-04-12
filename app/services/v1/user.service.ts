/** @format */


import { deleteCache, updateCache } from "@/cache";
import { STATUS_CODES } from "@/constants";
import { UserDocument, UserModel } from "@/models";
import { Logs } from "@/monitoring";
import { ZodSchema } from "@/schemas";
import { UpdateUserRequestType } from "@/types";
import { omit } from "lodash";


export const getUser = async (
    { profileId }: ZodSchema.UserSchema.GetUserInput["params"]
): Promise<UserDocument | object | null> => {
    try {
        const foundUser = await UserModel.findById(profileId);
        if (!foundUser) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "User Not Found"
        };

        return omit(foundUser.toJSON(), "password", "__v");
    } catch (error) {
        Logs.error("Get User Error:", error);
        return null;
    }
}

export const getUsers = async (): Promise<UserDocument[] | object | null> => {
    try {
        const users = await UserModel.find({});  // Pass empty object as query

        if (users.length > 0) {
            const refinedUsers = users.map((user) => omit(user.toJSON(), "password", "__v"));

            return refinedUsers;
        } else return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "No Users Found",
        };
    } catch (error) {
        Logs.error("Get Users Error:", error);
        return null;
    }
}

export const updateUser = async (
    { profileId }: ZodSchema.UserSchema.UpdateUserInput['params'],
    details: UpdateUserRequestType
): Promise<UserDocument | object | null> => {
    try {
        const foundUser = await UserModel.findById(profileId);
        if (!foundUser) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            errMessage: "User Not Found",
        };

        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                profileId,  // Pass ID directly
                details,
                { new: true }
            );

            if (updatedUser) {
                await updateCache(String(updatedUser._id), updatedUser);
                await deleteCache('users');

                return {
                    statusCode: STATUS_CODES.SUCCESS.OK,
                    message: "User data updated",
                    data: omit(updatedUser.toJSON(), "password", "__v")
                }
            }
            else return {
                statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "User Update Failed",
            }
        } catch (error) {
            Logs.error("Update User Error:", error);
            return null;
        }
    } catch (error) {
        Logs.error("Update User Error:", error);
        return null;
    }
}

export const deleteUser = async ({ profileId }: ZodSchema.UserSchema.DeleteUserInput["params"]): Promise<string | object | null> => {
    try {
        const foundUser = await UserModel.findById(profileId);
        if (!foundUser) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
            message: "User Not Found",
        };
        
        const deletedUser = await UserModel.findByIdAndDelete(profileId)  // Pass ID directly
        
        if (!deletedUser) return {
            statusCode: STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
            errMessage: "User Not Deleted"
        };

        await deleteCache(profileId);
        await deleteCache('users');

        return {
            statusCode: STATUS_CODES.SUCCESS.OK,
            message: "User Profile Deleted"
        };
    } catch (error) {
        Logs.error("Delete User Service Error:", error);
        return null;
    }
}

