/** @format */


import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "@/constants";
// import { ZodSchema } from "@/schemas";
// import { UserDocument } from "@/models";


export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || user.role !== "admin") {
        res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
            success: false,
            message: "Access Denied"
        });
        return;
    }

    next();
}