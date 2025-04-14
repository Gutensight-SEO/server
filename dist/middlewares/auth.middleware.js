"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const monitoring_1 = require("@/monitoring");
const constants_1 = require("@/constants");
const services_1 = require("@/services");
dotenv_1.default.config();
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        // console.log("Auth Header:", authHeader);
        if (!authHeader) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Authorization header missing"
            });
            return;
        }
        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || '');
            const user = await services_1.v1Services.getUser({ profileId: decoded.id });
            if (user && typeof user !== null) {
                if (typeof user === 'object' && 'errMessage' in user && 'statusCode' in user) {
                    res.status(user['statusCode']).json({
                        success: false,
                        message: user['errMessage'],
                    });
                    return;
                }
                else {
                    req.user = { id: String(user._id), role: user.role };
                    next();
                }
            }
            else {
                res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                    success: false,
                    message: "User not found"
                });
                return;
            }
        }
        catch (error) {
            monitoring_1.Logs.error("Auth Middleware Error - Unauthorized:", error);
            res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Access Token"
            });
            return;
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Auth Middleware Error - Server Error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
