/** @format */


import { STATUS_CODES } from "@/constants";
import { Logs } from "@/monitoring";
import { Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = (
    err: any,
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    Logs.error("Error Handler Middleware Error:", err);
    Logs.info("Error Handler Middleware Error Message:", err.message);

    res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
    })
}