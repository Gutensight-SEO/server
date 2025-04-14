"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const constants_1 = require("@/constants");
const monitoring_1 = require("@/monitoring");
const errorHandlerMiddleware = (err, req, res, next) => {
    monitoring_1.Logs.error("Error Handler Middleware Error:", err);
    monitoring_1.Logs.info("Error Handler Middleware Error Message:", err.message);
    res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
