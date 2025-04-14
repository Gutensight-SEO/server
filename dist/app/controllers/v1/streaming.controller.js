"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamingResult = void 0;
const cacheDB_1 = require("../../cache/streaming/cacheDB"); // Updated import
const constants_1 = require("../../constants");
const helpers_1 = require("../../helpers");
const monitoring_1 = require("../../monitoring");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const getResponse = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const correlationId = req.params.correlationId;
        const result = await (0, cacheDB_1.getStreamingRecord)(correlationId);
        if (!result) {
            res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
                success: true,
                status: 'pending',
                message: "Request is being processed"
            });
            return;
        }
        if (result.status === 'completed') {
            res.status(constants_1.STATUS_CODES.SUCCESS.OK).json({
                success: true,
                status: 'completed',
                data: result.response
            });
        }
        else {
            res.status(constants_1.STATUS_CODES.SUCCESS.ACCEPTED).json({
                success: true,
                status: result.status,
                message: "Still processing"
            });
        }
    }
    catch (error) {
        monitoring_1.Logs.error("Get Streaming Result error:", error);
        res.status(constants_1.STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
    }
});
exports.getStreamingResult = (0, helpers_1.errorHandlerWrapper)(getResponse);
