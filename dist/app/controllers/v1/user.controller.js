"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsers = exports.getUser = void 0;
const constants_1 = require("../../constants");
const helpers_1 = require("../../helpers");
const monitoring_1 = require("../../monitoring");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cache_1 = require("../../cache");
const workers_1 = require("../../workers");
const services_1 = require("../../services");
const streaming_1 = require("../../streaming");
const getUserHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const profileId = req.user.id;
        const result = await (0, cache_1.getOrSetCache)(String(profileId), () => services_1.v1Services.getUser({ profileId }));
        if (result !== null) {
            if (result['errMessage']) {
                res.status(result['statusCode']).json({
                    success: false,
                    message: result['errMessage'],
                });
                return;
            }
            else {
                res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "User Profile Fetched",
                    data: result
                });
                return;
            }
        }
        else {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Fetch User Failed"
            });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Get User Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const getUsersHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        // const user = req.user;
        // if (user.role !== 'admin') {
        //     res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
        //         success: false,
        //         message: "Unauthorized"
        //     })
        // }
        const results = await (0, cache_1.getOrSetCache)('users', () => (0, workers_1.userWorker)("getUsers"));
        if (results) {
            if (results['errMessage']) {
                res.status(results['statusCode']).json({
                    success: false,
                    message: results['errMessage'],
                    data: [],
                });
                return;
            }
            else {
                res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "Users Profile Fetched",
                    data: results
                });
                return;
            }
        }
        else {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Fetching Users Failed"
            });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Get Users Handler Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
        return;
    }
});
const updateUserHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const profileId = req.user.id; // Get ID from authenticated user
        const details = req.body;
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.UPDATE_USER, () => services_1.v1Services.updateUser({ profileId }, details));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Update request received",
            correlationId
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Update User Ctrl Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
    }
});
const deleteUserHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        if (!req.user) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.DELETE_USER, () => services_1.v1Services.deleteUser({ profileId: req.params.profileId }));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "User deletion in progress",
            correlationId
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Delete User Ctrl Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Please Try Again Later"
        });
    }
});
exports.getUser = (0, helpers_1.errorHandlerWrapper)(getUserHandler);
exports.getUsers = (0, helpers_1.errorHandlerWrapper)(getUsersHandler);
exports.updateUser = (0, helpers_1.errorHandlerWrapper)(updateUserHandler);
exports.deleteUser = (0, helpers_1.errorHandlerWrapper)(deleteUserHandler);
