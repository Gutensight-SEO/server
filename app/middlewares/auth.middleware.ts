/** @format */


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Logs } from "@/monitoring";
import { STATUS_CODES } from "@/constants";
// import { ZodSchema } from "@/schemas";
import { UserDocument } from "@/models";
import { v1Services } from "@/services";

dotenv.config();


export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        // console.log("Auth Header:", authHeader);
    
        if (!authHeader) {
            res.status(STATUS_CODES.CLIENT_ERRORS.BAD_REQUEST).json({
                success: false,
                message: "Authorization header missing"
            });
            return;
        }
    
        const accessToken = authHeader.split(" ")[1];
    
        if (!accessToken) {
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }
    
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
            const user: UserDocument | object = await v1Services.getUser({ profileId: decoded.id });
    
            if (user['errMessage']) {
                res.status(user['statusCode']).json({
                    success: false,
                    message: user['errMessage'],
                });
                return;
            } else {
                req.user = { id: user['_id'], role: user['role'] };
        
                next();
            }
    
        } catch (error) {
            Logs.error("Auth Middleware Error - Unauthorized:", error);
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Access Token"
            })
        }
    } catch (error) {
        Logs.error("Auth Middleware Error - Server Error:", error);
            res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Server Error! Try Again Later"
            })
    }
}