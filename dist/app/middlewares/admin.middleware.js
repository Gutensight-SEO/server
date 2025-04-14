"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const constants_1 = require("../constants");
// import { ZodSchema } from "../schemas";
// import { UserDocument } from "../models";
const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "admin") {
        res.status(constants_1.STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
            success: false,
            message: "Access Denied"
        });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
