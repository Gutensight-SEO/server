"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
/** @format */
const helpers_1 = require("@/helpers");
const constants_1 = require("@/constants");
const monitoring_1 = require("@/monitoring");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const services_1 = require("@/services");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("@/utils");
const globals_1 = require("@/globals");
const streaming_1 = require("@/streaming");
const registerUserHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const error = await helpers_1.Validators.ValidateUser(req.body);
        if (error) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message
            });
            return;
        }
        const { firstname, lastname, username, email, password } = req.body;
        const correlationId = await streaming_1.producer.publish(constants_1.KAFKA_TOPICS.REGISTER_USER, () => services_1.v1Services.register({
            firstname,
            lastname,
            username,
            email,
            password,
            role: 'user'
        }));
        res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
            success: true,
            message: "Registration in progress",
            url: `${globals_1.server_url}/${globals_1.server_version}/streaming/status/${correlationId}`
        });
    }
    catch (error) {
        monitoring_1.Logs.error("Register User Ctrl Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
    }
});
const loginUserHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { detail, password } = req.body;
        const result = await services_1.v1Services.login({ detail, password });
        if (result !== null) {
            if ('errMessage' in result) {
                res.status(result['statusCode']).json({
                    success: false,
                    message: result['errMessage']
                });
                return;
            }
            else {
                // Set both tokens in HTTP-only cookies
                res.cookie('accessToken', result["accessToken"], {
                    httpOnly: false, // Allow JS access
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 15 * 60 * 1000 // 15 minutes
                });
                res.cookie('refreshToken', result["refreshToken"], {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                    success: true,
                    message: "Login Successful",
                    data: {
                        user: result["user"]
                    },
                });
            }
        }
        else {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Login Failed"
            });
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Login User Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
    }
});
const refreshTokenHandler = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                message: "Refresh token not found"
            });
        }
        // verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Generate new access token
        const accessToken = (0, utils_1.GenerateToken)(decoded.userId, 'access');
        res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({ accessToken });
        return;
    }
    catch (error) {
        res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED);
        return;
    }
});
exports.register = (0, helpers_1.errorHandlerWrapper)(registerUserHandler);
exports.login = (0, helpers_1.errorHandlerWrapper)(loginUserHandler);
exports.refreshToken = (0, helpers_1.errorHandlerWrapper)(refreshTokenHandler);
