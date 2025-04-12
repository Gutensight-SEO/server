import { getStreamingRecord } from "@/cache/streaming/cacheDB"; // Updated import
import { STATUS_CODES } from "@/constants";
import { errorHandlerWrapper } from "@/helpers";
import { Logs } from "@/monitoring";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const getResponse = asyncHandler(async (req: Request, res: Response) => {
    try {
        const correlationId = req.params.correlationId;
        const result = await getStreamingRecord(correlationId);

        if (!result) {
            res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
                success: true,
                status: 'pending',
                message: "Request is being processed"
            });
            return;
        }

        if (result.status === 'completed') {
            res.status(STATUS_CODES.SUCCESS.OK).json({
                success: true,
                status: 'completed',
                data: result.response
            });
        } else {
            res.status(STATUS_CODES.SUCCESS.ACCEPTED).json({
                success: true,
                status: result.status,
                message: "Still processing"
            });
        }
    } catch (error) {
        Logs.error("Get Streaming Result error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        });
    }
});

export const getStreamingResult = errorHandlerWrapper(getResponse);