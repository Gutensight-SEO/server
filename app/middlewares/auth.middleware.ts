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
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || '') as jwt.JwtPayload;
    
            const user: UserDocument | object | null = await v1Services.getUser({ profileId: decoded.id });
    
            if (user && typeof user !== null) {
                if (typeof user === 'object' && 'errMessage' in user && 'statusCode' in user) {
                    res.status(user['statusCode'] as number).json({
                        success: false,
                        message: user['errMessage'],
                    });
                    return;
                } else {
                    req.user = { id: String((user as UserDocument)._id), role: (user as UserDocument).role };
            
                    next();
                }
            } else {
                res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                    success: false,
                    message: "User not found"
                });
                return;
            }
    
        } catch (error) {
            Logs.error("Auth Middleware Error - Unauthorized:", error);
            res.status(STATUS_CODES.CLIENT_ERRORS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Access Token"
            })
            return;
        }
    } catch (error) {
        Logs.error("Auth Middleware Error - Server Error:", error);
        res.status(STATUS_CODES.SERVER_ERRORS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error! Try Again Later"
        })
        return;
    }
}