"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsers = exports.getUser = void 0;
const cache_1 = require("@/cache");
const constants_1 = require("@/constants");
const models_1 = require("@/models");
const monitoring_1 = require("@/monitoring");
const lodash_1 = require("lodash");
const getUser = async ({ profileId }) => {
    try {
        const foundUser = await models_1.UserModel.findById(profileId);
        if (!foundUser)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "User Not Found"
            };
        return (0, lodash_1.omit)(foundUser.toJSON(), "password", "__v");
    }
    catch (error) {
        monitoring_1.Logs.error("Get User Error:", error);
        return null;
    }
};
exports.getUser = getUser;
const getUsers = async () => {
    try {
        const users = await models_1.UserModel.find({}); // Pass empty object as query
        if (users.length > 0) {
            const refinedUsers = users.map((user) => (0, lodash_1.omit)(user.toJSON(), "password", "__v"));
            return refinedUsers;
        }
        else
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "No Users Found",
            };
    }
    catch (error) {
        monitoring_1.Logs.error("Get Users Error:", error);
        return null;
    }
};
exports.getUsers = getUsers;
const updateUser = async ({ profileId }, details) => {
    try {
        const foundUser = await models_1.UserModel.findById(profileId);
        if (!foundUser)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                errMessage: "User Not Found",
            };
        try {
            const updatedUser = await models_1.UserModel.findByIdAndUpdate(profileId, // Pass ID directly
            details, { new: true });
            if (updatedUser) {
                await (0, cache_1.updateCache)(String(updatedUser._id), updatedUser);
                await (0, cache_1.deleteCache)('users');
                return {
                    statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
                    message: "User data updated",
                    data: (0, lodash_1.omit)(updatedUser.toJSON(), "password", "__v")
                };
            }
            else
                return {
                    statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                    errMessage: "User Update Failed",
                };
        }
        catch (error) {
            monitoring_1.Logs.error("Update User Error:", error);
            return null;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Update User Error:", error);
        return null;
    }
};
exports.updateUser = updateUser;
const deleteUser = async ({ profileId }) => {
    try {
        const foundUser = await models_1.UserModel.findById(profileId);
        if (!foundUser)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.NOT_FOUND,
                message: "User Not Found",
            };
        const deletedUser = await models_1.UserModel.findByIdAndDelete(profileId); // Pass ID directly
        if (!deletedUser)
            return {
                statusCode: constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST,
                errMessage: "User Not Deleted"
            };
        await (0, cache_1.deleteCache)(profileId);
        await (0, cache_1.deleteCache)('users');
        return {
            statusCode: constants_1.STATUS_CODES.SUCCESS.OK,
            message: "User Profile Deleted"
        };
    }
    catch (error) {
        monitoring_1.Logs.error("Delete User Service Error:", error);
        return null;
    }
};
exports.deleteUser = deleteUser;
